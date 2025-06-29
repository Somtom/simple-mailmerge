import React, { useState, useCallback, useEffect } from 'react';
import { FileText, AlertCircle, Info } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { ColumnMapping } from './components/ColumnMapping';
import { StepIndicator } from './components/StepIndicator';
import { GenerationProgress } from './components/GenerationProgress';
import { UserGuide } from './components/UserGuide';
import { OpenSourceNotice } from './components/OpenSourceNotice';
import { extractPlaceholders, generateMergedDocx, downloadDocx } from './utils/docxUtils';
import { parseExcelFile } from './utils/excelUtils';
import { PlaceholderData, ExcelColumn, ProcessingStep, MergeData } from './types';

function App() {
  const [docxFile, setDocxFile] = useState<File | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [placeholders, setPlaceholders] = useState<PlaceholderData[]>([]);
  const [excelColumns, setExcelColumns] = useState<ExcelColumn[]>([]);
  const [excelData, setExcelData] = useState<MergeData[]>([]);
  const [isProcessingDocx, setIsProcessingDocx] = useState(false);
  const [isProcessingExcel, setIsProcessingExcel] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [generatedDocxBlob, setGeneratedDocxBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for compact sticky header with hysteresis to prevent flickering
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // Use different thresholds for scrolling down vs up to prevent flickering
          if (!isScrolled && scrollY > 160) {
            setIsScrolled(true);
          } else if (isScrolled && scrollY < 80) {
            setIsScrolled(false);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  // Fixed step logic
  const hasDocxWithPlaceholders = !!docxFile && placeholders.length > 0;
  const hasExcelWithData = !!excelFile && excelColumns.length > 0 && excelData.length > 0;
  const hasAllMappings = placeholders.length > 0 && placeholders.every(p => p.excelColumn);
  const canGenerate = hasDocxWithPlaceholders && hasExcelWithData && hasAllMappings;

  const steps: ProcessingStep[] = [
    {
      id: 1,
      title: 'Upload DOCX',
      description: 'Template with placeholders',
      completed: hasDocxWithPlaceholders,
      current: !hasDocxWithPlaceholders
    },
    {
      id: 2,
      title: 'Upload Excel',
      description: 'Data source',
      completed: hasExcelWithData,
      current: hasDocxWithPlaceholders && !hasExcelWithData
    },
    {
      id: 3,
      title: 'Map Fields',
      description: 'Connect data to placeholders',
      completed: hasAllMappings,
      current: hasDocxWithPlaceholders && hasExcelWithData && !hasAllMappings
    },
    {
      id: 4,
      title: 'Generate',
      description: 'Create merged DOCX',
      completed: isComplete,
      current: canGenerate && !isComplete
    }
  ];

  // Smart auto-mapping function
  const performAutoMapping = useCallback((placeholderList: PlaceholderData[], columnList: ExcelColumn[]) => {
    return placeholderList.map(placeholder => {
      // Remove curly braces from placeholder for comparison
      const cleanPlaceholder = placeholder.placeholder.replace(/[{}]/g, '');

      // Try to find exact match first
      let matchingColumn = columnList.find(col =>
        col.name.toLowerCase() === cleanPlaceholder.toLowerCase()
      );

      // If no exact match, try partial matches
      if (!matchingColumn) {
        matchingColumn = columnList.find(col =>
          col.name.toLowerCase().includes(cleanPlaceholder.toLowerCase()) ||
          cleanPlaceholder.toLowerCase().includes(col.name.toLowerCase())
        );
      }

      return {
        ...placeholder,
        excelColumn: matchingColumn?.name,
        sampleValue: matchingColumn?.sampleValue
      };
    });
  }, []);

  const handleDocxUpload = useCallback(async (file: File) => {
    if (!file) {
      setDocxFile(null);
      setPlaceholders([]);
      return;
    }

    setError(null);
    setDocxFile(file);
    setIsProcessingDocx(true);

    try {
      const extractedPlaceholders = await extractPlaceholders(file);

      if (extractedPlaceholders.length === 0) {
        setError('No placeholders found in the DOCX file. Please ensure your document contains placeholders in the format {PLACEHOLDER_NAME}. For example: {FIRST_NAME}, {LAST_NAME}, {EMAIL}');
        setDocxFile(null);
        setPlaceholders([]);
        return;
      }

      const placeholderData: PlaceholderData[] = extractedPlaceholders.map(p => ({
        placeholder: p,
        excelColumn: undefined,
        sampleValue: undefined
      }));

      // If we already have Excel columns, perform auto-mapping
      if (excelColumns.length > 0) {
        const autoMappedPlaceholders = performAutoMapping(placeholderData, excelColumns);
        setPlaceholders(autoMappedPlaceholders);
      } else {
        setPlaceholders(placeholderData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process DOCX file. Please make sure it\'s a valid Word document.');
      setDocxFile(null);
      setPlaceholders([]);
    } finally {
      setIsProcessingDocx(false);
    }
  }, [excelColumns, performAutoMapping]);

  const handleExcelUpload = useCallback(async (file: File) => {
    if (!file) {
      setExcelFile(null);
      setExcelColumns([]);
      setExcelData([]);
      return;
    }

    setError(null);
    setExcelFile(file);
    setIsProcessingExcel(true);

    try {
      const { columns, data } = await parseExcelFile(file);

      if (columns.length === 0) {
        setError('No columns found in the Excel file. Please ensure your Excel file has headers in the first row.');
        setExcelFile(null);
        setExcelColumns([]);
        setExcelData([]);
        return;
      }

      if (data.length === 0) {
        setError('No data rows found in the Excel file. Please ensure your Excel file contains data below the headers.');
        setExcelFile(null);
        setExcelColumns([]);
        setExcelData([]);
        return;
      }

      setExcelColumns(columns);
      setExcelData(data);

      // If we already have placeholders, perform auto-mapping
      if (placeholders.length > 0) {
        const autoMappedPlaceholders = performAutoMapping(placeholders, columns);
        setPlaceholders(autoMappedPlaceholders);
      }
    } catch (err) {
      setError('Failed to process Excel file. Please make sure it\'s a valid Excel file with proper headers.');
      setExcelFile(null);
      setExcelColumns([]);
      setExcelData([]);
    } finally {
      setIsProcessingExcel(false);
    }
  }, [placeholders, performAutoMapping]);

  const handleMappingChange = useCallback((placeholder: string, column: string) => {
    setPlaceholders(prev => prev.map(p =>
      p.placeholder === placeholder
        ? {
            ...p,
            excelColumn: column || undefined,
            sampleValue: column ? excelColumns.find(c => c.name === column)?.sampleValue : undefined
          }
        : p
    ));
  }, [excelColumns]);

  const handleGenerate = useCallback(async () => {
    if (!docxFile || !excelData.length || !placeholders.every(p => p.excelColumn)) {
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const mapping: { [placeholder: string]: string } = {};
      placeholders.forEach(p => {
        if (p.excelColumn) {
          mapping[p.placeholder] = p.excelColumn;
        }
      });

      const docxBlob = await generateMergedDocx(docxFile, excelData, mapping);
      setGeneratedDocxBlob(docxBlob);
      setIsComplete(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate merged DOCX. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [docxFile, excelData, placeholders]);

  const handleDownload = useCallback(() => {
    if (generatedDocxBlob) {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      downloadDocx(generatedDocxBlob, `merged-document-${timestamp}.docx`);
    }
  }, [generatedDocxBlob]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DOCX Mail Merge</h1>
                <p className="text-gray-600">Merge Excel data into Word document templates</p>
              </div>
            </div>
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Info className="h-5 w-5" />
              <span className="font-medium">How to Use</span>
            </button>
          </div>
        </div>
      </div>

      <div className={`sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10 transition-all duration-200 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-200 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
            <StepIndicator steps={steps} showDescription={!isScrolled} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showGuide && <UserGuide onClose={() => setShowGuide(false)} />}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-900">Error</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* DOCX Upload */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <FileUpload
              onFileSelect={handleDocxUpload}
              acceptedTypes=".docx"
              title="Step 1: DOCX Template"
              description="Upload your Word document template. Use placeholders like {FIRST_NAME}, {LAST_NAME}, {EMAIL} where you want data to be inserted."
              selectedFile={docxFile}
              loading={isProcessingDocx}
            />

            {placeholders.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Found Placeholders ({placeholders.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {placeholders.map((placeholder) => (
                    <code
                      key={placeholder.placeholder}
                      className="px-1 py-1 bg-blue-100 text-blue-800 rounded text-sm font-mono"
                    >
                      {placeholder.placeholder}
                    </code>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  These placeholders will be replaced with data from your Excel file.
                </p>
              </div>
            )}
          </div>

          {/* Excel Upload */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <FileUpload
              onFileSelect={handleExcelUpload}
              acceptedTypes=".xlsx,.xls"
              title="Step 2: Excel Data"
              description="Upload your Excel file with column headers in the first row and data in the rows below. Each row will create one merged document."
              selectedFile={excelFile}
              loading={isProcessingExcel}
            />

            {excelColumns.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Found Columns ({excelColumns.length}) • {excelData.length} data rows
                </h4>
                <div className="text-sm text-gray-600 mb-2">Preview</div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {excelColumns.map((column) => (
                    <div
                      key={column.name}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm"
                    >
                      <span className="font-medium">{column.name}</span>
                      <span className="text-gray-600 truncate ml-2 flex-1 text-right">
                        {column.sampleValue}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Each row will generate one personalized document.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Column Mapping */}
        {placeholders.length > 0 && excelColumns.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <ColumnMapping
              placeholders={placeholders}
              excelColumns={excelColumns}
              onMappingChange={handleMappingChange}
            />
          </div>
        )}

        {/* Generate Button */}
        {canGenerate && !isGenerating && !isComplete && (
          <div className="text-center mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 text-sm">
                <strong>Ready to generate!</strong> This will create {excelData.length} personalized documents merged into one DOCX file.
              </p>
            </div>
            <button
              onClick={handleGenerate}
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-lg"
            >
              <FileText className="h-6 w-6 mr-2" />
              Generate Merged DOCX ({excelData.length} records)
            </button>
          </div>
        )}

        {/* Generation Progress */}
        <GenerationProgress
          isGenerating={isGenerating}
          isComplete={isComplete}
          onDownload={handleDownload}
          recordCount={excelData.length}
        />

        {/* Open Source Notice */}
        <OpenSourceNotice />
      </div>
    </div>
  );
}

export default App;

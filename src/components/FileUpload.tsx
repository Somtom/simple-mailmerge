import React, { useCallback, useState } from 'react';
import { Upload, X, Check, Info } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes: string;
  title: string;
  description: string;
  selectedFile?: File | null;
  loading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedTypes,
  title,
  description,
  selectedFile,
  loading = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const clearFile = useCallback(() => {
    onFileSelect(null as any);
  }, [onFileSelect]);

  const isDocxUpload = acceptedTypes.includes('.docx');

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      {/* Additional guidance for DOCX */}
      {isDocxUpload && !selectedFile && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-start space-x-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Template Requirements:</p>
            <ul className="text-xs space-y-1">
              <li>• Use curly braces for placeholders: <code className="bg-blue-100 mx-1 rounded">{'{FIRST_NAME}'}</code></li>
              <li>• Placeholder names can be mapped to any Excel column</li>
              <li>• Save your document as .docx format</li>
            </ul>
          </div>
        </div>
      )}

      {/* Additional guidance for Excel */}
      {!isDocxUpload && !selectedFile && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-start space-x-2">
          <Info className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">Excel File Requirements:</p>
            <ul className="text-xs space-y-1">
              <li>• First row must contain column headers</li>
              <li>• Each row below represents one record to merge</li>
              <li>• Column names will be mapped to your DOCX placeholders</li>
            </ul>
          </div>
        </div>
      )}

      {selectedFile ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-900">{selectedFile.name}</p>
              <p className="text-sm text-green-700">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • File uploaded successfully
              </p>
            </div>
          </div>
          <button
            onClick={clearFile}
            className="p-1 hover:bg-green-100 rounded-full transition-colors"
            disabled={loading}
            title="Remove file"
          >
            <X className="h-5 w-5 text-green-600" />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="mb-4">
            <label
              htmlFor={`file-upload-${title.replace(/\s+/g, '-').toLowerCase()}`}
              className="cursor-pointer"
            >
              <span className="text-blue-600 hover:text-blue-500 font-medium">
                Click to upload
              </span>
              <span className="text-gray-600"> or drag and drop</span>
              <input
                id={`file-upload-${title.replace(/\s+/g, '-').toLowerCase()}`}
                type="file"
                className="sr-only"
                accept={acceptedTypes}
                onChange={handleFileSelect}
                disabled={loading}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">
            {acceptedTypes.includes('.docx') ? 'Word documents (.docx) only' : 'Excel files (.xlsx, .xls) only'}
          </p>
        </div>
      )}

      {loading && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Processing file...</span>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { ArrowRight, FileText, Table, Check, X, Info } from 'lucide-react';
import { PlaceholderData, ExcelColumn } from '../types';

interface ColumnMappingProps {
  placeholders: PlaceholderData[];
  excelColumns: ExcelColumn[];
  onMappingChange: (placeholder: string, column: string) => void;
}

export const ColumnMapping: React.FC<ColumnMappingProps> = ({
  placeholders,
  excelColumns,
  onMappingChange
}) => {
  const mappedCount = placeholders.filter(p => p.excelColumn).length;
  const totalCount = placeholders.length;
  const isComplete = mappedCount === totalCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Step 3: Map Excel Columns to DOCX Placeholders
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Connect each placeholder in your Word template to the corresponding Excel column.
          This tells the system which data to put where.
        </p>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2">
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
            isComplete ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {isComplete ? (
              <Check className="h-4 w-4" />
            ) : (
              <span className="text-xs">{mappedCount}/{totalCount}</span>
            )}
            <span>
              {isComplete ? 'All fields mapped - ready to generate!' : `${mappedCount} of ${totalCount} mapped`}
            </span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      {!isComplete && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-blue-800 font-medium mb-1">How mapping works:</p>
            <p className="text-blue-700">
              For each placeholder like <code className="bg-blue-100 mx-1 rounded">{'{FIRST_NAME}'}</code> in your Word document,
              select the Excel column that contains the corresponding data (like "First Name" or "FirstName").
            </p>
          </div>
        </div>
      )}

      {/* Mapping Cards - Stacked Layout */}
      <div className="space-y-4">
        {placeholders.map((placeholder, index) => (
          <div
            key={placeholder.placeholder}
            className={`bg-white border-2 rounded-lg p-4 transition-all ${
              placeholder.excelColumn
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 lg:items-center">
              {/* Placeholder Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700">Word Template Placeholder</span>
                </div>
                <code className="block px-3 py-2 bg-blue-100 text-blue-800 rounded text-sm font-mono break-all">
                  {placeholder.placeholder}
                </code>
              </div>

              {/* Arrow - Hidden on mobile */}
              <div className="hidden lg:flex items-center justify-center flex-shrink-0">
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>

              {/* Mapping Control */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <Table className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700">Excel Column</span>
                </div>
                <select
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    placeholder.excelColumn
                      ? 'border-green-300 bg-green-50 text-green-800'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                  value={placeholder.excelColumn || ''}
                  onChange={(e) => onMappingChange(placeholder.placeholder, e.target.value)}
                >
                  <option value="">Choose Excel column...</option>
                  {excelColumns.map((column) => (
                    <option key={column.name} value={column.name}>
                      {column.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-center flex-shrink-0">
                {placeholder.excelColumn ? (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Check className="h-5 w-5" />
                    <span className="text-sm font-medium hidden sm:inline">Mapped</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-gray-400">
                    <X className="h-5 w-5" />
                    <span className="text-sm font-medium hidden sm:inline">Not mapped</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sample Value Preview */}
            {placeholder.excelColumn && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-700 font-medium">Preview with sample data:</span>
                  <div className="flex items-center space-x-2">
                    <code className="text-gray-500">{placeholder.placeholder}</code>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                    <span className="text-green-800 font-mono bg-green-100 px-2 py-1 rounded">
                      {excelColumns.find(c => c.name === placeholder.excelColumn)?.sampleValue || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      {placeholders.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-gray-700">
                <span className="font-medium">{placeholders.length}</span> placeholders found in Word template
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Table className="h-4 w-4 text-green-600" />
              <span className="text-gray-700">
                <span className="font-medium">{excelColumns.length}</span> columns available in Excel file
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

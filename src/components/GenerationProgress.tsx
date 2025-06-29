import React from 'react';
import { Download, CheckCircle } from 'lucide-react';

interface GenerationProgressProps {
  isGenerating: boolean;
  isComplete: boolean;
  onDownload: () => void;
  recordCount: number;
}

export const GenerationProgress: React.FC<GenerationProgressProps> = ({
  isGenerating,
  isComplete,
  onDownload,
  recordCount
}) => {
  if (!isGenerating && !isComplete) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {isGenerating && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Generating Merged DOCX
          </h3>
          <p className="text-gray-600">
            Processing {recordCount} records and merging into Word documents...
          </p>
        </div>
      )}

      {isComplete && (
        <div className="text-center">
          <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            DOCX Generated Successfully!
          </h3>
          <p className="text-gray-600 mb-6">
            Your merged Word document with {recordCount} records is ready for download.
          </p>
          <button
            onClick={onDownload}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Merged DOCX
          </button>
        </div>
      )}
    </div>
  );
};

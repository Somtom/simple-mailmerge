import React from 'react';
import { X, FileText, Table, ArrowRight, Download, CheckCircle } from 'lucide-react';

interface UserGuideProps {
  onClose: () => void;
}

export const UserGuide: React.FC<UserGuideProps> = ({ onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">How to Use DOCX Mail Merge</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Steps */}
        <div className="space-y-6">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Prepare Your Word Template</h3>
              <p className="text-sm text-gray-600 mb-2">
                Create a Word document with placeholders where you want data to appear.
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>Example placeholders:</strong><br />
                <code className="text-blue-600">{'{FIRST_NAME}'}</code> - Person's first name<br />
                <code className="text-blue-600">{'{LAST_NAME}'}</code> - Person's last name<br />
                <code className="text-blue-600">{'{EMAIL}'}</code> - Email address<br />
                <code className="text-blue-600">{'{COMPANY}'}</code> - Company name
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
              <Table className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Prepare Your Excel Data</h3>
              <p className="text-sm text-gray-600 mb-2">
                Create an Excel file with column headers in the first row and data in the rows below.
              </p>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <strong>Excel structure:</strong><br />
                Row 1: <code>FIRST_NAME | LAST_NAME | EMAIL | COMPANY</code><br />
                Row 2: <code>John | Smith | john@email.com | ABC Corp</code><br />
                Row 3: <code>Jane | Doe | jane@email.com | XYZ Ltd</code>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
              <ArrowRight className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Map Fields</h3>
              <p className="text-sm text-gray-600">
                Connect each placeholder in your Word template to the corresponding Excel column.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-orange-100 p-2 rounded-full flex-shrink-0">
              <Download className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">4. Generate & Download</h3>
              <p className="text-sm text-gray-600">
                Generate your merged document with all records combined into one DOCX file.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Tips */}
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              Best Practices
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Use descriptive placeholder names that allow easy identification
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Make sure Excel column headers match your placeholder names (without the curly braces) for quick automatic mapping
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                Keep placeholder names simple - avoid spaces and special characters
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">💡 Pro Tip</h4>
            <p className="text-sm text-yellow-700">
              The generated DOCX file contains all your records separated by page breaks.
              You can easily convert it to PDF using Word's "Save as PDF" feature if needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

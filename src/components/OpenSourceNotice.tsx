import React from 'react';
import { Github } from 'lucide-react';

export const OpenSourceNotice: React.FC = () => {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="text-center">
        <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
          <Github className="w-4 h-4 mr-2" />
          <span className="font-medium">Open Source & Privacy</span>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          All processing happens locally in your browser - no data is sent to any server or tracked.
          This tool is completely open source.
        </p>
        <a
          href="https://github.com/Somtom/simple-mailmerge"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          View on GitHub
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

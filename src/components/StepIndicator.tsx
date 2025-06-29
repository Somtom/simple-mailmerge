import React from 'react';
import { Check } from 'lucide-react';
import { ProcessingStep } from '../types';

interface StepIndicatorProps {
  steps: ProcessingStep[];
  showDescription?: boolean;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, showDescription = true }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  step.completed
                    ? 'bg-green-600 text-white'
                    : step.current
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.completed ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              <div className="mt-2 text-center max-w-24">
                <div
                  className={`text-sm font-medium ${
                    step.current ? 'text-blue-600' : 'text-gray-900'
                  }`}
                >
                  {step.title}
                </div>
                <div
                  className={`text-xs text-gray-500 mt-1 transition-all duration-200 ${
                    showDescription ? 'max-h-9 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  steps[index + 1].completed || steps[index + 1].current
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

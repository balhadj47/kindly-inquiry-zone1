
import React from 'react';

interface WizardProgressIndicatorProps {
  steps: { id: string; title: string }[];
  currentStep: number;
}

export const WizardProgressIndicator: React.FC<WizardProgressIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              index <= currentStep
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {index + 1}
          </div>
          <span
            className={`ml-2 text-sm font-medium ${
              index <= currentStep ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            {step.title}
          </span>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-4 ${
                index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

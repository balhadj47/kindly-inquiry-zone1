
import React from 'react';
import { Check } from 'lucide-react';
import { TripWizardStep } from '@/hooks/useTripWizard';

interface WizardProgressProps {
  currentStep: TripWizardStep;
  allSteps: TripWizardStep[];
  getStepLabel: (step: TripWizardStep) => string;
  goToStep: (step: TripWizardStep) => void;
  completedSteps: Set<TripWizardStep>;
}

const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  allSteps,
  getStepLabel,
  goToStep,
  completedSteps
}) => {
  const currentStepIndex = allSteps.indexOf(currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {allSteps.map((step, index) => {
          const isCompleted = completedSteps.has(step);
          const isCurrent = step === currentStep;
          const isAccessible = index <= currentStepIndex || isCompleted;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => isAccessible && goToStep(step)}
                  disabled={!isAccessible}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all
                    ${isCurrent
                      ? 'bg-blue-600 text-white border-blue-600'
                      : isCompleted
                        ? 'bg-green-600 text-white border-green-600'
                        : isAccessible
                          ? 'bg-white text-gray-600 border-gray-300 hover:border-blue-300'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </button>
                <span className={`mt-2 text-xs font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                  {getStepLabel(step)}
                </span>
              </div>
              {index < allSteps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${index < currentStepIndex || completedSteps.has(allSteps[index + 1]) ? 'bg-green-600' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default WizardProgress;


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
    <div className="mb-12">
      <div className="flex items-center justify-between relative">
        {allSteps.map((step, index) => {
          const isCompleted = completedSteps.has(step);
          const isCurrent = step === currentStep;
          const isAccessible = index <= currentStepIndex || isCompleted;

          return (
            <div key={step} className="flex items-center relative z-10">
              <div className="flex flex-col items-center group">
                <button
                  onClick={() => isAccessible && goToStep(step)}
                  disabled={!isAccessible}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold 
                    border-2 transition-all duration-300 ease-in-out transform
                    shadow-lg hover:shadow-xl
                    ${isCurrent
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-600 scale-110 shadow-blue-200'
                      : isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white border-green-600 hover:scale-105 shadow-green-200'
                        : isAccessible
                          ? 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:shadow-md hover:scale-105'
                          : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                    }
                    ${isAccessible ? 'hover:transform hover:scale-105' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 animate-scale-in" />
                  ) : (
                    <span className="font-bold">{index + 1}</span>
                  )}
                </button>
                
                <div className="mt-3 text-center">
                  <span className={`
                    text-sm font-medium transition-colors duration-200
                    ${isCurrent 
                      ? 'text-blue-600 font-semibold' 
                      : isCompleted 
                        ? 'text-green-600 font-medium' 
                        : isAccessible
                          ? 'text-gray-600'
                          : 'text-gray-400'
                    }
                  `}>
                    {getStepLabel(step)}
                  </span>
                  
                  {isCurrent && (
                    <div className="mt-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
              
              {index < allSteps.length - 1 && (
                <div className="relative">
                  {/* Background line */}
                  <div className="absolute top-6 left-6 w-20 sm:w-24 md:w-32 lg:w-40 h-0.5 bg-gray-200"></div>
                  
                  {/* Progress line */}
                  <div 
                    className={`
                      absolute top-6 left-6 h-0.5 transition-all duration-500 ease-in-out
                      ${index < currentStepIndex || completedSteps.has(allSteps[index + 1]) 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 w-20 sm:w-24 md:w-32 lg:w-40' 
                        : isCurrent && index === currentStepIndex - 1
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 w-10 sm:w-12 md:w-16 lg:w-20'
                          : 'w-0'
                      }
                    `}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Progress indicator */}
      <div className="mt-8 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-in-out rounded-full"
          style={{ 
            width: `${((currentStepIndex + 1) / allSteps.length) * 100}%` 
          }}
        ></div>
      </div>
      
      <div className="mt-2 text-center">
        <span className="text-sm text-gray-500">
          Étape {currentStepIndex + 1} sur {allSteps.length}
        </span>
      </div>
    </div>
  );
};

export default WizardProgress;

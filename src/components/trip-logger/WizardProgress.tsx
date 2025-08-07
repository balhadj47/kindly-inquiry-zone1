
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

  const getStepDescription = (step: TripWizardStep): string => {
    switch (step) {
      case 'van':
        return 'Sélection du véhicule';
      case 'company':
        return 'Choix de l\'entreprise';
      case 'team':
        return 'Sélection de l\'équipe';
      case 'details':
        return 'Informations détaillées';
      default:
        return '';
    }
  };

  return (
    <div className="mb-8">
      {/* Tab-style Progress */}
      <div className="flex items-center bg-gray-50 rounded-lg p-1 overflow-x-auto">
        {allSteps.map((step, index) => {
          const isCompleted = completedSteps.has(step);
          const isCurrent = step === currentStep;
          const isAccessible = index <= currentStepIndex || isCompleted;

          return (
            <button
              key={step}
              onClick={() => isAccessible && goToStep(step)}
              disabled={!isAccessible}
              className={`
                flex-1 min-w-0 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200
                flex items-center justify-center gap-2 whitespace-nowrap
                ${isCurrent
                  ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                  : isCompleted
                    ? 'text-green-600 hover:bg-white/50'
                    : isAccessible
                      ? 'text-gray-600 hover:bg-white/50'
                      : 'text-gray-400 cursor-not-allowed'
                }
                ${isAccessible ? 'hover:shadow-sm' : ''}
              `}
            >
              <div className="flex items-center gap-2">
                {/* Step Icon */}
                <div className={`
                  flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold
                  ${isCurrent
                    ? 'bg-blue-100 text-blue-600'
                    : isCompleted
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {isCompleted ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                
                {/* Step Title and Description in one line */}
                <div className="text-left min-w-0">
                  <span className="font-medium">{getStepLabel(step)}</span>
                  <span className="mx-1 opacity-60">•</span>
                  <span className="text-xs opacity-75">{getStepDescription(step)}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Current Step Indicator */}
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-500">
          Étape {currentStepIndex + 1} sur {allSteps.length}
        </span>
      </div>
    </div>
  );
};

export default WizardProgress;

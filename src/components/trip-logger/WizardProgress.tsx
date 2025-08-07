
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { TripWizardStep } from '@/hooks/useTripWizard';

interface WizardProgressProps {
  currentStep: TripWizardStep;
  completedSteps: Set<TripWizardStep>;
  allSteps: TripWizardStep[];
  getStepLabel: (step: TripWizardStep) => string;
  goToStep: (step: TripWizardStep) => void;
}

const getStepInfo = (step: TripWizardStep) => {
  switch (step) {
    case 'van':
      return {
        title: 'Véhicule',
        description: 'Sélection véhicule et km',
        icon: '🚐'
      };
    case 'company':
      return {
        title: 'Entreprise', 
        description: 'Choix entreprise et filiale',
        icon: '🏢'
      };
    case 'team':
      return {
        title: 'Équipe',
        description: 'Membres et rôles',
        icon: '👥'
      };
    case 'details':
      return {
        title: 'Détails',
        description: 'Notes et dates',
        icon: '📝'
      };
    default:
      return {
        title: step,
        description: '',
        icon: '📋'
      };
  }
};

const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  completedSteps,
  allSteps,
  goToStep
}) => {
  console.log('🔄 WizardProgress: Current step:', currentStep, 'Completed steps:', Array.from(completedSteps));

  return (
    <div className="w-full mb-8">
      <div className="flex bg-muted/30 rounded-lg p-1 overflow-x-auto">
        {allSteps.map((step, index) => {
          const stepInfo = getStepInfo(step);
          const isCompleted = completedSteps.has(step);
          const isCurrent = currentStep === step;
          const isClickable = isCompleted || isCurrent || index === 0;

          console.log('🔄 WizardProgress: Step', step, '- isCompleted:', isCompleted, 'isCurrent:', isCurrent, 'isClickable:', isClickable);

          return (
            <button
              key={step}
              onClick={() => {
                if (isClickable) {
                  console.log('🔄 WizardProgress: Navigating to step:', step);
                  goToStep(step);
                }
              }}
              disabled={!isClickable}
              className={cn(
                "flex-1 min-w-0 px-3 py-3 rounded-md transition-all duration-200 text-left",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                {
                  "bg-primary text-primary-foreground shadow-sm": isCurrent,
                  "bg-green-100 text-green-800 hover:bg-green-200": isCompleted && !isCurrent,
                  "hover:bg-muted/60": !isCurrent && !isCompleted && isClickable,
                  "opacity-50 cursor-not-allowed": !isClickable,
                  "text-muted-foreground": !isCurrent && !isCompleted
                }
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex-shrink-0 flex items-center">
                  {isCompleted && !isCurrent ? (
                    <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <span className="text-lg">{stepInfo.icon}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={cn(
                    "font-medium text-sm truncate",
                    isCurrent && "text-primary-foreground"
                  )}>
                    {stepInfo.title}
                  </div>
                  <div className={cn(
                    "text-xs opacity-75 truncate",
                    isCurrent ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {stepInfo.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WizardProgress;


import React from 'react';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormProgressStep {
  id: string;
  label: string;
  description?: string;
}

interface FormProgressProps {
  steps: FormProgressStep[];
  currentStep: string;
  completedSteps: string[];
  onStepClick?: (stepId: string) => void;
  variant?: 'horizontal' | 'vertical';
  showDescriptions?: boolean;
}

const FormProgress: React.FC<FormProgressProps> = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
  variant = 'horizontal',
  showDescriptions = false
}) => {
  const getStepStatus = (stepId: string) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepIndex = (stepId: string) => steps.findIndex(step => step.id === stepId);

  if (variant === 'vertical') {
    return (
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isClickable = onStepClick && (status === 'completed' || status === 'current');
          
          return (
            <div key={step.id} className="flex items-start gap-4">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                    status === 'completed' && "bg-primary border-primary text-primary-foreground",
                    status === 'current' && "border-primary bg-primary/10 text-primary",
                    status === 'upcoming' && "border-muted-foreground/30 bg-background text-muted-foreground",
                    isClickable && "hover:scale-105 cursor-pointer",
                    !isClickable && "cursor-default"
                  )}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </button>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-0.5 h-8 mt-2",
                    completedSteps.includes(steps[index + 1].id) || steps[index + 1].id === currentStep
                      ? "bg-primary" 
                      : "bg-muted-foreground/20"
                  )} />
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 pb-8">
                <h4 className={cn(
                  "font-medium",
                  status === 'current' && "text-primary",
                  status === 'upcoming' && "text-muted-foreground"
                )}>
                  {step.label}
                </h4>
                {showDescriptions && step.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const status = getStepStatus(step.id);
        const isClickable = onStepClick && (status === 'completed' || status === 'current');
        
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                  status === 'completed' && "bg-primary border-primary text-primary-foreground",
                  status === 'current' && "border-primary bg-primary/10 text-primary",
                  status === 'upcoming' && "border-muted-foreground/30 bg-background text-muted-foreground",
                  isClickable && "hover:scale-105 cursor-pointer",
                  !isClickable && "cursor-default"
                )}
              >
                {status === 'completed' ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </button>
              
              <div className="text-center">
                <p className={cn(
                  "text-sm font-medium",
                  status === 'current' && "text-primary",
                  status === 'upcoming' && "text-muted-foreground"
                )}>
                  {step.label}
                </p>
                {showDescriptions && step.description && (
                  <p className="text-xs text-muted-foreground mt-1 max-w-20">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-4",
                completedSteps.includes(steps[index + 1].id) || steps[index + 1].id === currentStep
                  ? "bg-primary" 
                  : "bg-muted-foreground/20"
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default FormProgress;

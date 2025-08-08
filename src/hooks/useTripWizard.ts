
import { useState } from 'react';

// Updated to match actual step names used in components
export type TripWizardStep = 'van' | 'company' | 'team' | 'details' | 'review';

export interface TripWizardState {
  currentStep: TripWizardStep;
  completedSteps: TripWizardStep[];
}

export const useTripWizard = (initialStep: TripWizardStep = 'van') => {
  const [currentStep, setCurrentStep] = useState<TripWizardStep>(initialStep);
  const [completedSteps, setCompletedSteps] = useState<TripWizardStep[]>([]);

  const goToStep = (step: TripWizardStep) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    const steps: TripWizardStep[] = ['van', 'company', 'team', 'details', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);
      markStepComplete(currentStep);
    }
  };

  const previousStep = () => {
    const steps: TripWizardStep[] = ['van', 'company', 'team', 'details', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const markStepComplete = (step: TripWizardStep) => {
    setCompletedSteps(prev => [...prev.filter(s => s !== step), step]);
  };

  const isStepComplete = (step: TripWizardStep): boolean => {
    return completedSteps.includes(step);
  };

  return {
    currentStep,
    completedSteps,
    goToStep,
    nextStep,
    previousStep,
    markStepComplete,
    isStepComplete
  };
};

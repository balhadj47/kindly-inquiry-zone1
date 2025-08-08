
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

  const allSteps: TripWizardStep[] = ['van', 'company', 'team', 'details', 'review'];

  const goToStep = (step: TripWizardStep) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    const currentIndex = allSteps.indexOf(currentStep);
    if (currentIndex < allSteps.length - 1) {
      const nextStep = allSteps[currentIndex + 1];
      setCurrentStep(nextStep);
      markStepComplete(currentStep);
    }
  };

  const previousStep = () => {
    const currentIndex = allSteps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(allSteps[currentIndex - 1]);
    }
  };

  // Aliases for backward compatibility
  const goToNextStep = nextStep;
  const goToPreviousStep = previousStep;

  const markStepComplete = (step: TripWizardStep) => {
    setCompletedSteps(prev => [...prev.filter(s => s !== step), step]);
  };

  const isStepComplete = (step: TripWizardStep): boolean => {
    return completedSteps.includes(step);
  };

  const resetWizard = () => {
    setCurrentStep(initialStep);
    setCompletedSteps([]);
  };

  const getStepLabel = (step: TripWizardStep): string => {
    const labels: Record<TripWizardStep, string> = {
      van: 'Véhicule',
      company: 'Entreprise',
      team: 'Équipe',
      details: 'Détails',
      review: 'Révision'
    };
    return labels[step];
  };

  const isFirstStep = currentStep === allSteps[0];
  const isLastStep = currentStep === allSteps[allSteps.length - 1];

  return {
    currentStep,
    completedSteps,
    goToStep,
    nextStep,
    previousStep,
    goToNextStep, // Alias
    goToPreviousStep, // Alias
    markStepComplete,
    isStepComplete,
    resetWizard,
    getStepLabel,
    allSteps,
    isFirstStep,
    isLastStep
  };
};

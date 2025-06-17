
import { useState } from 'react';

export type TripWizardStep = 'van' | 'company' | 'team' | 'details';

const STEP_ORDER: TripWizardStep[] = ['van', 'company', 'team', 'details'];

export const useTripWizard = () => {
  const [currentStep, setCurrentStep] = useState<TripWizardStep>('van');

  const currentStepIndex = STEP_ORDER.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEP_ORDER.length - 1;

  const goToNextStep = () => {
    if (!isLastStep) {
      setCurrentStep(STEP_ORDER[currentStepIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStep(STEP_ORDER[currentStepIndex - 1]);
    }
  };

  const goToStep = (step: TripWizardStep) => {
    setCurrentStep(step);
  };

  const resetWizard = () => {
    setCurrentStep('van');
  };

  const getStepLabel = (step: TripWizardStep): string => {
    switch (step) {
      case 'van':
        return 'Véhicule';
      case 'company':
        return 'Entreprise';
      case 'team':
        return 'Équipe';
      case 'details':
        return 'Détails';
      default:
        return '';
    }
  };

  return {
    currentStep,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    resetWizard,
    getStepLabel,
    totalSteps: STEP_ORDER.length,
    allSteps: STEP_ORDER,
  };
};


import { useState, useMemo } from 'react';
import { useTripWizard, TripWizardStep } from '@/hooks/useTripWizard';

export const useTripFormWizardState = () => {
  const {
    currentStep,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    resetWizard,
    getStepLabel,
    allSteps
  } = useTripWizard();

  const [completedSteps, setCompletedSteps] = useState<Set<TripWizardStep>>(new Set());

  // Form progress steps for enhanced UX
  const formSteps = useMemo(() => [
    { id: 'van', label: 'Véhicule', description: 'Sélection du véhicule et kilométrage' },
    { id: 'company', label: 'Entreprise', description: 'Choix de l\'entreprise et filiale' },
    { id: 'team', label: 'Équipe', description: 'Sélection des membres et rôles' },
    { id: 'details', label: 'Détails', description: 'Informations complémentaires' }
  ], []);

  const currentStepId = currentStep;
  const completedStepIds = Array.from(completedSteps);

  return {
    currentStep,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    resetWizard,
    getStepLabel,
    allSteps,
    completedSteps,
    setCompletedSteps,
    formSteps,
    currentStepId,
    completedStepIds,
  };
};

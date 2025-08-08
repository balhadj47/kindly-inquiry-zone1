
import { useState } from 'react';
import { useTripFormValidation } from '@/hooks/useTripFormValidation';
import { toast } from 'sonner';

const STEPS = [
  { id: 'vehicle', title: 'Véhicule' },
  { id: 'team', title: 'Équipe' },
  { id: 'companies', title: 'Entreprises' },
  { id: 'details', title: 'Détails' },
  { id: 'review', title: 'Révision' }
];

export const useTripFormWizardLogic = (formData: any) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { validateTeamSelection } = useTripFormValidation();

  const canGoNext = () => {
    const step = STEPS[currentStep];
    
    switch (step.id) {
      case 'vehicle':
        return formData.vanId.trim() !== '';
      
      case 'team': {
        const validation = validateTeamSelection(formData.selectedUsersWithRoles);
        return validation.isValid;
      }
      
      case 'companies':
        return formData.selectedCompanies.length > 0;
      
      case 'details':
        return formData.startKm.trim() !== '' && 
               formData.startDate !== null && 
               formData.endDate !== null;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canGoNext()) {
      // Show validation warnings for team step
      if (STEPS[currentStep].id === 'team') {
        const validation = validateTeamSelection(formData.selectedUsersWithRoles);
        if (validation.warnings.length > 0) {
          validation.warnings.forEach(warning => {
            toast.warning(warning);
          });
        }
      }
      setCurrentStep(prev => prev + 1);
      return true;
    } else {
      // Show specific validation errors
      const step = STEPS[currentStep];
      if (step.id === 'team') {
        const validation = validateTeamSelection(formData.selectedUsersWithRoles);
        validation.errors.forEach(error => {
          toast.error(error);
        });
      } else {
        toast.error('Veuillez compléter tous les champs requis');
      }
      return false;
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return {
    STEPS,
    currentStep,
    setCurrentStep,
    canGoNext,
    handleNext,
    handlePrevious,
    isLastStep: currentStep === STEPS.length - 1,
    isFirstStep: currentStep === 0,
  };
};

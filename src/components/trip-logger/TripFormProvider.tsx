
import React, { useMemo, useCallback } from 'react';
import { useTripFormState } from '@/hooks/trip-form/useTripFormState';
import { useTripFormValidation } from '@/hooks/trip-form/useTripFormValidation';
import { useTripFormSubmission } from '@/hooks/trip-form/useTripFormSubmission';
import { useTripFormWizardState } from '@/hooks/trip-form/useTripFormWizardState';
import { useTripFormData } from '@/hooks/trip-form/useTripFormData';
import { TripWizardStep } from '@/hooks/useTripWizard';
import { CompanyBranchSelection } from '@/types/company-selection';

interface TripFormContextType {
  // Form data and handlers
  formData: any;
  handleInputChange: (field: string, value: string) => void;
  handleDateChange: (field: string, value: Date | undefined) => void;
  handleUserRoleSelection: (userId: string, roles: any[]) => void;
  handleCompanySelection: (companies: CompanyBranchSelection[]) => void;
  userSearchQuery: string;
  setUserSearchQuery: (query: string) => void;
  
  // Wizard state
  currentStep: TripWizardStep;
  isFirstStep: boolean;
  isLastStep: boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: TripWizardStep) => void;
  getStepLabel: (step: TripWizardStep) => string;
  allSteps: TripWizardStep[];
  completedSteps: Set<TripWizardStep>;
  
  // Data
  companies: any[];
  availableVans: any[];
  vans: any[];
  lastKm: number | null;
  loadingLastKm: boolean;
  
  // Actions
  handleNext: () => void;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;

  // Progress tracking
  formSteps: Array<{id: string, label: string, description?: string}>;
  currentStepId: string;
  completedStepIds: string[];
}

const TripFormContext = React.createContext<TripFormContextType | undefined>(undefined);

export const useTripFormContext = () => {
  const context = React.useContext(TripFormContext);
  if (!context) {
    throw new Error('useTripFormContext must be used within TripFormProvider');
  }
  return context;
};

interface TripFormProviderProps {
  children: React.ReactNode;
}

export const TripFormProvider: React.FC<TripFormProviderProps> = ({ children }) => {
  console.log('🔄 TripFormProvider: Component render started');
  
  // Use the extracted hooks
  const formState = useTripFormState();
  const validation = useTripFormValidation();
  const wizardState = useTripFormWizardState();
  const formData = useTripFormData(formState.formData, formState.handleInputChange);
  
  const submission = useTripFormSubmission({
    validateForm: validation.validateForm,
    resetForm: formState.resetForm,
    setUserSearchQuery: formState.setUserSearchQuery,
    resetWizard: wizardState.resetWizard,
    setCompletedSteps: wizardState.setCompletedSteps,
  });

  // Memoize handlers to prevent unnecessary re-renders
  const handleNext = useCallback(() => {
    if (validation.validateCurrentStep(wizardState.currentStep, formState.formData)) {
      wizardState.setCompletedSteps(prev => new Set([...prev, wizardState.currentStep]));
      wizardState.goToNextStep();
    }
  }, [validation.validateCurrentStep, wizardState.currentStep, formState.formData, wizardState.goToNextStep, wizardState.setCompletedSteps]);

  const handleSubmit = useCallback(async () => {
    await submission.handleSubmit(formState.formData);
  }, [submission.handleSubmit, formState.formData]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo<TripFormContextType>(() => ({
    // Form state
    ...formState,
    
    // Wizard state
    ...wizardState,
    
    // Data
    ...formData,
    
    // Actions
    handleNext,
    handleSubmit,
    isSubmitting: submission.isSubmitting,
  }), [
    formState,
    wizardState,
    formData,
    handleNext,
    handleSubmit,
    submission.isSubmitting,
  ]);

  console.log('🔄 TripFormProvider: Component render completed');

  return (
    <TripFormContext.Provider value={contextValue}>
      {children}
    </TripFormContext.Provider>
  );
};

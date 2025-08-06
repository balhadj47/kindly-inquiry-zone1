
import React, { useMemo, useCallback } from 'react';
import { useTripFormStateMultiCompany } from '@/hooks/trip-form/useTripFormStateMultiCompany';
import { useTripFormValidation } from '@/hooks/trip-form/useTripFormValidation';
import { useTripFormSubmission } from '@/hooks/trip-form/useTripFormSubmission';
import { useTripFormWizardState } from '@/hooks/trip-form/useTripFormWizardState';
import { useTripFormData } from '@/hooks/trip-form/useTripFormData';
import { TripWizardStep } from '@/hooks/useTripWizard';
import { SelectedCompany } from '@/hooks/useTripFormMultiCompany';

interface TripFormContextType {
  // Form data and handlers
  formData: any;
  handleInputChange: (field: string, value: string) => void;
  handleDateChange: (field: string, value: Date | undefined) => void;
  handleUserRoleSelection: (userId: string, roles: any[]) => void;
  handleAddCompany: (companyId: string, branchId: string, companyName?: string, branchName?: string) => void;
  handleRemoveCompany: (index: number) => void;
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
  
  // Use the multi-company form state
  const formState = useTripFormStateMultiCompany();
  const validation = useTripFormValidation();
  const wizardState = useTripFormWizardState();
  const formData = useTripFormData(formState.formData, formState.handleInputChange);
  
  const submission = useTripFormSubmission({
    validateForm: validation.validateForm,
    resetForm: formState.resetForm,
    setUserSearchQuery: formState.setUserSearchQuery,
    resetWizard: wizardState.resetWizard,
    setCompletedSteps: wizardState.setCompletedSteps,
    useMultiCompany: true, // Enable multi-company support
  });

  // Validate current step for multi-company
  const validateCurrentStepMultiCompany = useCallback((step: TripWizardStep, data: any) => {
    switch (step) {
      case 'company':
        return data.selectedCompanies && data.selectedCompanies.length > 0;
      default:
        return validation.validateCurrentStep(step, data);
    }
  }, [validation.validateCurrentStep]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleNext = useCallback(() => {
    if (validateCurrentStepMultiCompany(wizardState.currentStep, formState.formData)) {
      wizardState.setCompletedSteps(prev => new Set([...prev, wizardState.currentStep]));
      wizardState.goToNextStep();
    }
  }, [validateCurrentStepMultiCompany, wizardState.currentStep, formState.formData, wizardState.goToNextStep, wizardState.setCompletedSteps]);

  const handleSubmit = useCallback(async () => {
    await submission.handleSubmit(formState.formData);
  }, [submission.handleSubmit, formState.formData]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo<TripFormContextType>(() => ({
    // Form state (now includes multi-company handlers)
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

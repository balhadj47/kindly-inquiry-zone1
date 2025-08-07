import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTripForm } from '@/hooks/useTripForm';
import { useTrip } from '@/contexts/TripContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompanies } from '@/hooks/useCompanies';
import { useVans } from '@/hooks/useVans';
import { validateTripForm } from './TripFormValidation';
import { useTripSubmission } from './TripFormSubmission';
import { useTripWizard, TripWizardStep } from '@/hooks/useTripWizard';
import { useVanKilometerLogic } from '@/hooks/useVanKilometerLogic';
import { useFormValidation } from '@/hooks/useFormValidation';
import { useQueryClient } from '@tanstack/react-query';

interface TripFormContextType {
  // Form data and handlers
  formData: any;
  handleInputChange: (field: string, value: string) => void;
  handleDateChange: (field: string, value: Date | undefined) => void;
  handleUserRoleSelection: (userId: string, roles: any[]) => void;
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
}

const TripFormContext = React.createContext<TripFormContextType | undefined>(undefined);

export const useTripFormContext = () => {
  const context = React.useContext(TripFormContext);
  if (!context) {
    throw new Error('useTripFormContext must be used within TripFormProvider');
  }
  return context;
};

interface TripFormProviderDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export const TripFormProviderDialog: React.FC<TripFormProviderDialogProps> = ({ 
  children, 
  onSuccess 
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { trips } = useTrip();
  const { data: companies } = useCompanies();
  const { vans } = useVans();
  const { formData, handleInputChange, handleDateChange, handleUserRoleSelection, resetForm } = useTripForm();
  const { submitTrip } = useTripSubmission();
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validateStep, showValidationError } = useFormValidation();
  const queryClient = useQueryClient();
  
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

  // Create a stable callback for startKm changes
  const handleStartKmChange = useCallback((value: string) => {
    handleInputChange('startKm', value);
  }, [handleInputChange]);

  const { lastKm, loadingLastKm } = useVanKilometerLogic({
    vanId: formData.vanId,
    startKm: formData.startKm,
    onStartKmChange: handleStartKmChange
  });

  // Stable calculation of available vans
  const availableVans = useMemo(() => {
    const activeVanIds = trips
      .filter(trip => trip.status === 'active')
      .map(trip => trip.van);
    
    return vans.filter(van => !activeVanIds.includes(van.id));
  }, [trips, vans]);

  const handleNext = () => {
    if (validateStep(currentStep, formData)) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      goToNextStep();
    } else {
      showValidationError(currentStep);
    }
  };

  const handleSubmit = async () => {
    const validation = validateTripForm(formData);
    if (!validation.isValid) {
      toast({
        title: t.error,
        description: validation.errorMessage,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitTrip(formData);
      
      // Invalidate active trips cache to refresh the employee list immediately
      await queryClient.invalidateQueries({
        queryKey: ['trips', 'active']
      });
      
      console.log('🔄 TripFormProviderDialog: Cache invalidated after successful submission');
      
      resetForm();
      setUserSearchQuery('');
      resetWizard();
      setCompletedSteps(new Set());
      
      toast({
        title: t.success,
        description: t.tripLoggedSuccessfully,
      });

      // Call onSuccess callback to close dialog
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contextValue: TripFormContextType = {
    formData,
    handleInputChange,
    handleDateChange,
    handleUserRoleSelection,
    userSearchQuery,
    setUserSearchQuery,
    currentStep,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    getStepLabel,
    allSteps,
    completedSteps,
    companies: companies || [],
    availableVans,
    vans,
    lastKm,
    loadingLastKm,
    handleNext,
    handleSubmit,
    isSubmitting,
  };

  return (
    <TripFormContext.Provider value={contextValue}>
      {children}
    </TripFormContext.Provider>
  );
};

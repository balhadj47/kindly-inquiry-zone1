import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTripForm } from '@/hooks/useTripForm';
import { useTrip } from '@/contexts/TripContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompanies } from '@/hooks/useCompanies';
import { useVans } from '@/hooks/useVans';
import { validateTripForm } from './trip-logger/TripFormValidation';
import { useTripSubmission } from './trip-logger/TripFormSubmission';
import { useTripWizard, TripWizardStep } from '@/hooks/useTripWizard';
import { useVanKilometerLogic } from '@/hooks/useVanKilometerLogic';
import { useFormValidation } from '@/hooks/useFormValidation';
import WizardProgress from './trip-logger/WizardProgress';
import WizardNavigation from './trip-logger/WizardNavigation';
import VanSelectionStep from './trip-logger/steps/VanSelectionStep';
import CompanySelectionStep from './trip-logger/steps/CompanySelectionStep';
import TeamSelectionStep from './trip-logger/steps/TeamSelectionStep';
import TripDetailsStep from './trip-logger/steps/TripDetailsStep';

const TripLoggerForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { trips } = useTrip();
  const { companies } = useCompanies();
  const { vans } = useVans();
  const { formData, handleInputChange, handleDateChange, handleUserRoleSelection, resetForm } = useTripForm();
  const { submitTrip } = useTripSubmission();
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const { validateStep, showValidationError } = useFormValidation();
  
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

  const { lastKm, loadingLastKm } = useVanKilometerLogic({
    vanId: formData.vanId,
    startKm: formData.startKm,
    onStartKmChange: (value) => handleInputChange('startKm', value)
  });

  // Memoize the availableVans calculation to prevent unnecessary re-renders
  const availableVans = useMemo(() => {
    const activeVanIds = trips
      .filter(trip => trip.status === 'active')
      .map(trip => trip.van);
    return vans.filter(van => !activeVanIds.includes(van.id));
  }, [vans, trips]);

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

    try {
      await submitTrip(formData);
      resetForm();
      setUserSearchQuery('');
      resetWizard();
      setCompletedSteps(new Set());
      
      toast({
        title: t.success,
        description: t.tripLoggedSuccessfully,
      });
    } catch (error) {
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'van':
        return (
          <VanSelectionStep
            availableVans={availableVans}
            totalVans={vans}
            selectedVanId={formData.vanId}
            onVanChange={(value) => handleInputChange('vanId', value)}
            startKm={formData.startKm}
            onStartKmChange={(value) => handleInputChange('startKm', value)}
            lastKm={lastKm}
            loadingLastKm={loadingLastKm}
          />
        );
      case 'company':
        return (
          <CompanySelectionStep
            companies={companies}
            selectedCompanyId={formData.companyId}
            selectedBranchId={formData.branchId}
            onCompanyChange={(value) => handleInputChange('companyId', value)}
            onBranchChange={(value) => handleInputChange('branchId', value)}
          />
        );
      case 'team':
        return (
          <TeamSelectionStep
            userSearchQuery={userSearchQuery}
            setUserSearchQuery={setUserSearchQuery}
            selectedUsersWithRoles={formData.selectedUsersWithRoles}
            onUserRoleSelection={handleUserRoleSelection}
          />
        );
      case 'details':
        return (
          <TripDetailsStep
            notes={formData.notes}
            onNotesChange={(value) => handleInputChange('notes', value)}
            startDate={formData.startDate}
            onStartDateChange={(date) => handleDateChange('startDate', date)}
            endDate={formData.endDate}
            onEndDateChange={(date) => handleDateChange('endDate', date)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{t.logNewTrip}</CardTitle>
      </CardHeader>
      <CardContent>
        <WizardProgress
          currentStep={currentStep}
          allSteps={allSteps}
          getStepLabel={getStepLabel}
          goToStep={goToStep}
          completedSteps={completedSteps}
        />

        <div className="min-h-[400px]">
          {renderCurrentStep()}
        </div>

        <WizardNavigation
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onPrevious={goToPreviousStep}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default TripLoggerForm;

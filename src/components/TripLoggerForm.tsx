
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
  console.log('🔄 TripLoggerForm: Component render started');
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log('🔄 TripLoggerForm: Render count:', renderCount.current);

  const { t } = useLanguage();
  const { toast } = useToast();
  const { trips } = useTrip();
  const { companies } = useCompanies();
  const { vans } = useVans();
  const { formData, handleInputChange, handleDateChange, handleUserRoleSelection, resetForm } = useTripForm();
  const { submitTrip } = useTripSubmission();
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Create a stable callback for startKm changes that won't change on every render
  const handleStartKmChange = useCallback((value: string) => {
    console.log('🔄 TripLoggerForm: handleStartKmChange called with:', value);
    handleInputChange('startKm', value);
  }, [handleInputChange]);

  const { lastKm, loadingLastKm } = useVanKilometerLogic({
    vanId: formData.vanId,
    startKm: formData.startKm,
    onStartKmChange: handleStartKmChange
  });

  useEffect(() => {
    console.log('🔄 TripLoggerForm: useEffect triggered, checking dependencies');
    console.log('🔄 TripLoggerForm: trips.length:', trips.length);
    console.log('🔄 TripLoggerForm: vans.length:', vans.length);
    console.log('🔄 TripLoggerForm: companies.length:', companies.length);
  }, [trips, vans, companies]);

  // Stable calculation of available vans
  const availableVans = useMemo(() => {
    console.log('🔄 TripLoggerForm: Recalculating availableVans');
    const activeVanIds = trips
      .filter(trip => trip.status === 'active')
      .map(trip => trip.van);
    
    const result = vans.filter(van => !activeVanIds.includes(van.id));
    console.log('🔄 TripLoggerForm: Available vans count:', result.length);
    return result;
  }, [trips, vans]);

  // Stable van change handler
  const handleVanChange = useCallback((vanId: string) => {
    console.log('🔄 TripLoggerForm: Van changed to:', vanId);
    handleInputChange('vanId', vanId);
  }, [handleInputChange]);

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
    } finally {
      setIsSubmitting(false);
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
            onVanChange={handleVanChange}
            startKm={formData.startKm}
            onStartKmChange={handleStartKmChange}
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

  console.log('🔄 TripLoggerForm: Component render completed');

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">📋</span>
          </div>
          {t.logNewTrip}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <WizardProgress
          currentStep={currentStep}
          allSteps={allSteps}
          getStepLabel={getStepLabel}
          goToStep={goToStep}
          completedSteps={completedSteps}
        />

        <div className="min-h-[500px] bg-gray-50 rounded-xl p-6 border border-gray-100">
          {renderCurrentStep()}
        </div>

        <WizardNavigation
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onPrevious={goToPreviousStep}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  );
};

export default TripLoggerForm;

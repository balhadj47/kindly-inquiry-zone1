import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useTripForm } from '@/hooks/useTripForm';
import { useTrip } from '@/contexts/TripContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCompanies } from '@/hooks/useCompanies';
import { useVans } from '@/hooks/useVans';
import { useLastTripKm } from '@/hooks/useLastTripKm';
import { validateTripForm } from './trip-logger/TripFormValidation';
import { useTripSubmission } from './trip-logger/TripFormSubmission';
import { useTripWizard, TripWizardStep } from '@/hooks/useTripWizard';
import WizardProgress from './trip-logger/WizardProgress';
import VanSelectionStep from './trip-logger/steps/VanSelectionStep';
import CompanySelectionStep from './trip-logger/steps/CompanySelectionStep';
import TeamSelectionStep from './trip-logger/steps/TeamSelectionStep';
import TripDetailsStep from './trip-logger/steps/TripDetailsStep';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TripLoggerForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { trips } = useTrip();
  const { companies } = useCompanies();
  const { vans } = useVans();
  const { formData, handleInputChange, handleUserRoleSelection, resetForm } = useTripForm();
  const { submitTrip } = useTripSubmission();
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const { lastKm, loading: loadingLastKm } = useLastTripKm(formData.vanId);
  
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

  // Auto-populate starting kilometers when a van is selected and lastKm is available
  useEffect(() => {
    if (lastKm !== null && formData.vanId && !formData.startKm) {
      console.log('Auto-populating start km with:', lastKm);
      handleInputChange('startKm', lastKm.toString());
    }
  }, [lastKm, formData.vanId, formData.startKm, handleInputChange]);

  // Filter out vans that are currently in active trips using van ID
  const activeTrips = trips.filter(trip => trip.status === 'active');
  const activeVanIds = activeTrips.map(trip => trip.van);
  const availableVans = vans.filter(van => !activeVanIds.includes(van.id));

  // Validation for each step
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 'van':
        return !!(formData.vanId && formData.startKm && parseInt(formData.startKm) >= 0);
      case 'company':
        return !!(formData.companyId && formData.branchId);
      case 'team':
        return formData.selectedUsersWithRoles.length > 0;
      case 'details':
        return true; // Notes are optional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      goToNextStep();
    } else {
      let errorMessage = '';
      switch (currentStep) {
        case 'van':
          errorMessage = 'Veuillez sélectionner un véhicule et entrer le kilométrage de départ';
          break;
        case 'company':
          errorMessage = 'Veuillez sélectionner une entreprise et une succursale';
          break;
        case 'team':
          errorMessage = 'Veuillez sélectionner au moins un utilisateur avec des rôles';
          break;
      }
      toast({
        title: 'Étape incomplète',
        description: errorMessage,
        variant: "destructive",
      });
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

        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={goToPreviousStep}
            disabled={isFirstStep}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Précédent</span>
          </Button>

          {isLastStep ? (
            <Button
              type="button"
              onClick={handleSubmit}
              className="flex items-center space-x-2"
            >
              <span>{t.logTrip}</span>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              className="flex items-center space-x-2"
            >
              <span>Suivant</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TripLoggerForm;

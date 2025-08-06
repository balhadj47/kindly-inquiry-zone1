
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTripFormContext } from './TripFormProvider';
import { TripWizardStep } from '@/hooks/useTripWizard';

// Import steps
import VanSelectionStep from './steps/VanSelectionStep';
import MultiCompanySelectionStep from './steps/MultiCompanySelectionStep';
import TeamSelectionStep from './steps/TeamSelectionStep';
import TripDetailsStep from './steps/TripDetailsStep';

interface TripFormWizardMultiCompanyProps {
  onSuccess?: () => void;
}

export const TripFormWizardMultiCompany: React.FC<TripFormWizardMultiCompanyProps> = ({ onSuccess }) => {
  const {
    currentStep,
    isFirstStep,
    isLastStep,
    goToPreviousStep,
    handleNext,
    handleSubmit,
    isSubmitting,
    formData,
    handleAddCompany,
    handleRemoveCompany,
    handleInputChange,
    handleDateChange,
    handleUserRoleSelection,
    userSearchQuery,
    setUserSearchQuery,
    availableVans,
    vans,
    lastKm,
    loadingLastKm,
  } = useTripFormContext();

  const getStepTitle = (step: TripWizardStep) => {
    switch (step) {
      case 'van':
        return 'Sélection du véhicule';
      case 'company':
        return 'Sélection des entreprises';
      case 'team':
        return 'Sélection de l\'équipe';
      case 'details':
        return 'Détails du voyage';
      default:
        return '';
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
            onVanChange={(vanId) => handleInputChange('vanId', vanId)}
            startKm={formData.startKm}
            onStartKmChange={(value) => handleInputChange('startKm', value)}
            lastKm={lastKm}
            loadingLastKm={loadingLastKm}
          />
        );
      case 'company':
        return (
          <MultiCompanySelectionStep
            selectedCompanies={formData.selectedCompanies || []}
            onAddCompany={handleAddCompany}
            onRemoveCompany={handleRemoveCompany}
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

  const handleSubmitWrapper = async () => {
    try {
      await handleSubmit();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting trip:', error);
    }
  };

  // Calculate progress
  const stepOrder: TripWizardStep[] = ['van', 'company', 'team', 'details'];
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / stepOrder.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Étape {currentStepIndex + 1} sur {stepOrder.length}</span>
          <span>{Math.round(progress)}% complété</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {getStepTitle(currentStep)}
        </h2>
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {renderCurrentStep()}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={isFirstStep || isSubmitting}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Précédent
        </Button>

        {!isLastStep ? (
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            Suivant
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmitWrapper}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? 'Création...' : 'Créer la mission'}
          </Button>
        )}
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTripForm } from '@/hooks/useTripForm';
import { useTripSubmission } from './TripFormSubmission';
import { useTripFormValidation } from '@/hooks/useTripFormValidation';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useTripFormWizardLogic } from '@/hooks/useTripFormWizardLogic';
import { WizardProgressIndicator } from './wizard/WizardProgressIndicator';
import { WizardNavigationButtons } from './wizard/WizardNavigationButtons';

// Import step components
import VehicleSelectionStep from './steps/VehicleSelectionStep';
import TeamSelectionStep from './steps/TeamSelectionStep';
import CompanySelectionStep from './steps/CompanySelectionStep';
import TripDetailsStep from './steps/TripDetailsStep';
import ReviewStep from './steps/ReviewStep';

interface TripFormWizardProps {
  onSuccess: () => void;
}

export const TripFormWizard: React.FC<TripFormWizardProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const tripForm = useTripForm();
  const { submitTrip } = useTripSubmission();
  const { validateTeamSelection } = useTripFormValidation();
  const queryClient = useQueryClient();
  
  const {
    STEPS,
    currentStep,
    canGoNext,
    handleNext,
    handlePrevious,
    isLastStep,
    isFirstStep,
  } = useTripFormWizardLogic(tripForm.formData);

  const handleNavigationNext = () => {
    if (isLastStep) {
      handleSubmit();
    } else {
      handleNext();
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Final validation
      const teamValidation = validateTeamSelection(tripForm.formData.selectedUsersWithRoles);
      if (!teamValidation.isValid) {
        teamValidation.errors.forEach(error => {
          toast.error(error);
        });
        return;
      }

      await submitTrip(tripForm.formData);
      
      // Invalidate active trips cache to refresh the employee list immediately
      await queryClient.invalidateQueries({
        queryKey: ['trips', 'active']
      });
      
      console.log('🔄 TripFormWizard: Cache invalidated after successful submission');
      
      toast.success('Mission créée avec succès!');
      onSuccess();
    } catch (error) {
      console.error('Error submitting trip:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création de la mission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (STEPS[currentStep].id) {
      case 'vehicle':
        return (
          <VehicleSelectionStep 
            {...tripForm.formData}
            startKm={tripForm.formData.startKm}
            handleInputChange={tripForm.handleInputChange}
          />
        );
      case 'team':
        return (
          <TeamSelectionStep 
            selectedUsersWithRoles={tripForm.formData.selectedUsersWithRoles}
            onUserRoleSelection={tripForm.handleUserRoleSelection}
            userSearchQuery=""
            setUserSearchQuery={() => {}}
          />
        );
      case 'companies':
        return (
          <CompanySelectionStep 
            selectedCompanies={tripForm.formData.selectedCompanies}
            onCompanySelectionChange={tripForm.handleCompanySelection}
          />
        );
      case 'details':
        return (
          <TripDetailsStep 
            notes={tripForm.formData.notes}
            onNotesChange={(value: string) => tripForm.handleInputChange('notes', value)}
            startDate={tripForm.formData.startDate}
            onStartDateChange={(value: Date | undefined) => tripForm.handleDateChange('startDate', value)}
            endDate={tripForm.formData.endDate}
            onEndDateChange={(value: Date | undefined) => tripForm.handleDateChange('endDate', value)}
          />
        );
      case 'review':
        return (
          <ReviewStep 
            {...tripForm.formData}
            startKm={tripForm.formData.startKm}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <WizardProgressIndicator steps={STEPS} currentStep={currentStep} />

      <Card>
        <CardContent className="p-6">
          {renderCurrentStep()}
        </CardContent>
      </Card>

      <WizardNavigationButtons
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        canGoNext={canGoNext()}
        isSubmitting={isSubmitting}
        onPrevious={handlePrevious}
        onNext={handleNavigationNext}
      />
    </div>
  );
};

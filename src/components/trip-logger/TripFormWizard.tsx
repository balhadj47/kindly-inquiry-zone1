
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTripForm } from '@/hooks/useTripForm';
import { useTripSubmission } from './TripFormSubmission';
import { useTripFormValidation } from '@/hooks/useTripFormValidation';
import { toast } from 'sonner';

// Import step components
import VehicleSelectionStep from './steps/VehicleSelectionStep';
import TeamSelectionStep from './steps/TeamSelectionStep';
import CompanySelectionStep from './steps/CompanySelectionStep';
import TripDetailsStep from './steps/TripDetailsStep';
import ReviewStep from './steps/ReviewStep';

interface TripFormWizardProps {
  onSuccess: () => void;
}

const STEPS = [
  { id: 'vehicle', title: 'Véhicule', component: VehicleSelectionStep },
  { id: 'team', title: 'Équipe', component: TeamSelectionStep },
  { id: 'companies', title: 'Entreprises', component: CompanySelectionStep },
  { id: 'details', title: 'Détails', component: TripDetailsStep },
  { id: 'review', title: 'Révision', component: ReviewStep }
];

export const TripFormWizard: React.FC<TripFormWizardProps> = ({ onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const tripForm = useTripForm();
  const { submitTrip } = useTripSubmission();
  const { validateTeamSelection } = useTripFormValidation();

  const canGoNext = () => {
    const step = STEPS[currentStep];
    
    switch (step.id) {
      case 'vehicle':
        return tripForm.formData.vanId.trim() !== '';
      
      case 'team': {
        const validation = validateTeamSelection(tripForm.formData.selectedUsersWithRoles);
        return validation.isValid;
      }
      
      case 'companies':
        return tripForm.formData.selectedCompanies.length > 0;
      
      case 'details':
        return tripForm.formData.startKm.trim() !== '' && 
               tripForm.formData.startDate !== null && 
               tripForm.formData.endDate !== null;
      
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === STEPS.length - 1) {
      handleSubmit();
    } else if (canGoNext()) {
      // Show validation warnings for team step
      if (STEPS[currentStep].id === 'team') {
        const validation = validateTeamSelection(tripForm.formData.selectedUsersWithRoles);
        if (validation.warnings.length > 0) {
          validation.warnings.forEach(warning => {
            toast.warning(warning);
          });
        }
      }
      setCurrentStep(prev => prev + 1);
    } else {
      // Show specific validation errors
      const step = STEPS[currentStep];
      if (step.id === 'team') {
        const validation = validateTeamSelection(tripForm.formData.selectedUsersWithRoles);
        validation.errors.forEach(error => {
          toast.error(error);
        });
      } else {
        toast.error('Veuillez compléter tous les champs requis');
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
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
      toast.success('Mission créée avec succès!');
      onSuccess();
    } catch (error) {
      console.error('Error submitting trip:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la création de la mission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep].component;
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex justify-between items-center mb-8">
        {STEPS.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center ${index < STEPS.length - 1 ? 'flex-1' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`ml-2 text-sm font-medium ${
                index <= currentStep ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {step.title}
            </span>
            {index < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {STEPS[currentStep].id === 'vehicle' && (
            <VehicleSelectionStep 
              {...tripForm.formData}
              handleInputChange={tripForm.handleInputChange}
            />
          )}
          {STEPS[currentStep].id === 'team' && (
            <TeamSelectionStep 
              selectedUsersWithRoles={tripForm.formData.selectedUsersWithRoles}
              onUserRoleSelection={tripForm.handleUserRoleSelection}
              userSearchQuery=""
              setUserSearchQuery={() => {}}
            />
          )}
          {STEPS[currentStep].id === 'companies' && (
            <CompanySelectionStep 
              selectedCompanies={tripForm.formData.selectedCompanies}
              onCompanySelectionChange={tripForm.handleCompanySelection}
            />
          )}
          {STEPS[currentStep].id === 'details' && (
            <TripDetailsStep 
              notes={tripForm.formData.notes}
              onNotesChange={(value: string) => tripForm.handleInputChange('notes', value)}
              startDate={tripForm.formData.startDate}
              onStartDateChange={(value: Date | undefined) => tripForm.handleDateChange('startDate', value)}
              endDate={tripForm.formData.endDate}
              onEndDateChange={(value: Date | undefined) => tripForm.handleDateChange('endDate', value)}
            />
          )}
          {STEPS[currentStep].id === 'review' && (
            <ReviewStep {...tripForm.formData} />
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Précédent
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext() || isSubmitting}
        >
          {isLastStep ? (
            <>
              {isSubmitting ? 'Création...' : 'Créer la Mission'}
            </>
          ) : (
            <>
              Suivant
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};


import React from 'react';
import { useTripFormContext } from './TripFormProvider';
import WizardProgress from './WizardProgress';
import WizardNavigation from './WizardNavigation';
import { TripFormSteps } from './TripFormSteps';

interface TripFormWizardProps {
  onSuccess?: () => void;
}

export const TripFormWizard: React.FC<TripFormWizardProps> = ({ onSuccess }) => {
  console.log('🧙‍♂️ TripFormWizard: Component rendering');
  
  const {
    currentStep,
    isFirstStep,
    isLastStep,
    goToPreviousStep,
    goToStep,
    handleNext,
    handleSubmit,
    isSubmitting,
    completedSteps,
    allSteps,
    getStepLabel
  } = useTripFormContext();

  const handleFinalSubmit = async () => {
    await handleSubmit();
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-6">
      <WizardProgress 
        currentStep={currentStep}
        completedSteps={completedSteps}
        allSteps={allSteps}
        getStepLabel={getStepLabel}
        goToStep={goToStep}
      />
      
      <TripFormSteps />
      
      <WizardNavigation
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        isSubmitting={isSubmitting}
        onPrevious={goToPreviousStep}
        onNext={handleNext}
        onSubmit={handleFinalSubmit}
      />
    </div>
  );
};

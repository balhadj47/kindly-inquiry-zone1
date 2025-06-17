
import React from 'react';
import { useTripFormContext } from './TripFormProvider';
import WizardProgress from './WizardProgress';
import WizardNavigation from './WizardNavigation';
import { TripFormSteps } from './TripFormSteps';

export const TripFormWizard: React.FC = () => {
  const {
    currentStep,
    allSteps,
    getStepLabel,
    goToStep,
    completedSteps,
    isFirstStep,
    isLastStep,
    goToPreviousStep,
    handleNext,
    handleSubmit,
    isSubmitting,
  } = useTripFormContext();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <WizardProgress
          currentStep={currentStep}
          allSteps={allSteps}
          getStepLabel={getStepLabel}
          goToStep={goToStep}
          completedSteps={completedSteps}
        />

        <div className="mt-6">
          <TripFormSteps />
        </div>

        <WizardNavigation
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          onPrevious={goToPreviousStep}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

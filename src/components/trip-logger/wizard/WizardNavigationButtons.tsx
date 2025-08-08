
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WizardNavigationButtonsProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const WizardNavigationButtons: React.FC<WizardNavigationButtonsProps> = ({
  isFirstStep,
  isLastStep,
  canGoNext,
  isSubmitting,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="flex justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Précédent
      </Button>

      <Button
        type="button"
        onClick={onNext}
        disabled={!canGoNext || isSubmitting}
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
  );
};

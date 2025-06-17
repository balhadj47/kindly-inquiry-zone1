
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WizardNavigationProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  isFirstStep,
  isLastStep,
  onPrevious,
  onNext,
  onSubmit
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="flex items-center space-x-2"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Précédent</span>
      </Button>

      {isLastStep ? (
        <Button
          type="button"
          onClick={onSubmit}
          className="flex items-center space-x-2"
        >
          <span>{t.logTrip}</span>
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          className="flex items-center space-x-2"
        >
          <span>Suivant</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default WizardNavigation;


import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WizardNavigationProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  isFirstStep,
  isLastStep,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting = false
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isSubmitting}
        className="flex items-center space-x-2 px-6 py-3 h-auto bg-white hover:bg-gray-50 border-gray-300 text-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="font-medium">Précédent</span>
      </Button>

      {isLastStep ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-8 py-3 h-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Enregistrement...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{t.logTrip}</span>
            </>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="flex items-center space-x-2 px-6 py-3 h-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Suivant</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default WizardNavigation;

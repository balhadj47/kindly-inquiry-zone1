
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTripSubmission } from '@/components/trip-logger/TripFormSubmission';
import { TripWizardStep } from '@/hooks/useTripWizard';

interface UseTripFormSubmissionProps {
  validateForm: (formData: any) => boolean;
  resetForm: () => void;
  setUserSearchQuery: (query: string) => void;
  resetWizard: () => void;
  setCompletedSteps: (steps: React.SetStateAction<Set<TripWizardStep>>) => void;
}

export const useTripFormSubmission = ({
  validateForm,
  resetForm,
  setUserSearchQuery,
  resetWizard,
  setCompletedSteps,
}: UseTripFormSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const { submitTrip } = useTripSubmission();

  const handleSubmit = useCallback(async (formData: any) => {
    if (!validateForm(formData)) {
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
  }, [validateForm, submitTrip, resetForm, resetWizard, toast, t, setUserSearchQuery, setCompletedSteps]);

  return {
    handleSubmit,
    isSubmitting,
  };
};

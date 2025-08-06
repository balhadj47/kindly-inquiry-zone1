
import { useCallback, useState } from 'react';
import { useTrip } from '@/contexts/TripContext';
import { useTripMultiCompany } from '@/contexts/TripContextMultiCompany';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface SubmissionOptions {
  validateForm: (data: any) => { isValid: boolean; errorMessage?: string };
  resetForm: () => void;
  setUserSearchQuery: (query: string) => void;
  resetWizard: () => void;
  setCompletedSteps: (steps: any) => void;
  useMultiCompany?: boolean;
}

export const useTripFormSubmission = (options: SubmissionOptions) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTrip } = useTrip();
  const { addTripWithMultipleCompanies } = useTripMultiCompany();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = useCallback(async (formData: any) => {
    const validation = options.validateForm(formData);
    if (!validation.isValid) {
      toast({
        title: t.error,
        description: validation.errorMessage,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Get driver from the first selected user (assuming driver is first)
      const driver = formData.selectedUsersWithRoles[0]?.userId || '';
      
      if (options.useMultiCompany && formData.selectedCompanies?.length > 0) {
        // Use multi-company submission
        const tripData = {
          van: formData.vanId,
          driver,
          company: '', // Keep for backward compatibility
          branch: '', // Keep for backward compatibility
          companies: formData.selectedCompanies,
          notes: formData.notes,
          userIds: formData.selectedUsersWithRoles.map((u: any) => u.userId),
          userRoles: formData.selectedUsersWithRoles,
          startKm: parseInt(formData.startKm) || 0,
          startDate: formData.startDate,
          endDate: formData.endDate,
        };
        
        await addTripWithMultipleCompanies(tripData);
      } else {
        // Use legacy single company submission
        const tripData = {
          van: formData.vanId,
          driver,
          company: formData.companyId || (formData.selectedCompanies?.[0]?.companyId || ''),
          branch: formData.branchId || (formData.selectedCompanies?.[0]?.branchId || ''),
          notes: formData.notes,
          userIds: formData.selectedUsersWithRoles.map((u: any) => u.userId),
          userRoles: formData.selectedUsersWithRoles,
          startKm: parseInt(formData.startKm) || 0,
          startDate: formData.startDate,
          endDate: formData.endDate,
        };
        
        await addTrip(tripData);
      }
      
      // Reset form and wizard state
      options.resetForm();
      options.setUserSearchQuery('');
      options.resetWizard();
      options.setCompletedSteps(new Set());
      
      toast({
        title: t.success,
        description: t.tripLoggedSuccessfully,
      });
    } catch (error) {
      console.error('Error submitting trip:', error);
      toast({
        title: t.error,
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [options, addTrip, addTripWithMultipleCompanies, toast, t]);

  return {
    handleSubmit,
    isSubmitting,
  };
};

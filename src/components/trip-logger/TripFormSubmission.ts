
import { useTrip } from '@/contexts/TripContext';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQueryClient } from '@tanstack/react-query';

export const useTripSubmission = () => {
  const { addTrip } = useTrip();
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const submitTrip = async (formData: any) => {
    try {
      console.log('🚀 TripSubmission: Submitting trip with data:', formData);
      
      if (!formData.selectedUsersWithRoles || formData.selectedUsersWithRoles.length === 0) {
        throw new Error('At least one user with roles must be selected');
      }

      if (!formData.startKm || formData.startKm.trim() === '') {
        throw new Error('Starting kilometers must be provided');
      }

      // Prepare the trip data
      const tripToSubmit = {
        van: formData.vanId,
        driver: formData.driver || 'N/A',
        company: formData.company || 'N/A',
        branch: formData.branch || 'N/A',
        notes: formData.notes || '',
        userIds: formData.selectedUsersWithRoles.map((user: any) => user.userId),
        userRoles: formData.selectedUsersWithRoles,
        startKm: parseInt(formData.startKm),
        startDate: formData.startDate,
        endDate: formData.endDate,
        selectedCompanies: formData.selectedCompanies || []
      };

      console.log('🚀 TripSubmission: Prepared trip data:', tripToSubmit);
      
      // Submit the trip
      await addTrip(tripToSubmit);
      
      console.log('✅ TripSubmission: Trip submitted successfully');
      
      // Invalidate active trips cache to refresh the employee list immediately
      await queryClient.invalidateQueries({
        queryKey: ['trips', 'active']
      });
      
      // Also invalidate general trips cache
      await queryClient.invalidateQueries({
        queryKey: ['trips']
      });
      
      console.log('🔄 TripSubmission: Cache invalidated for immediate refresh');
      
    } catch (error) {
      console.error('❌ TripSubmission: Error submitting trip:', error);
      throw error;
    }
  };

  return {
    submitTrip
  };
};

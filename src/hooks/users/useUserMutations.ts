
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from './types';

export const useUserMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const invalidateUsers = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const updateUser = useMutation({
    mutationFn: async ({ id, ...userData }: Partial<User> & { id: string }) => {
      const numericId = parseInt(id, 10);
      
      const updateData: any = {
        name: userData.name,
        phone: userData.phone,
        role_id: userData.role_id,
        status: userData.status,
        badge_number: userData.badge_number || null,
        date_of_birth: userData.date_of_birth && userData.date_of_birth.trim() !== '' ? userData.date_of_birth : null,
        place_of_birth: userData.place_of_birth && userData.place_of_birth.trim() !== '' ? userData.place_of_birth : null,
        address: userData.address && userData.address.trim() !== '' ? userData.address : null,
        driver_license: userData.driver_license && userData.driver_license.trim() !== '' ? userData.driver_license : null,
        identification_national: userData.identification_national && userData.identification_national.trim() !== '' ? userData.identification_national : null,
        carte_national: userData.carte_national && userData.carte_national.trim() !== '' ? userData.carte_national : null,
        carte_national_start_date: userData.carte_national_start_date && userData.carte_national_start_date.trim() !== '' ? userData.carte_national_start_date : null,
        carte_national_expiry_date: userData.carte_national_expiry_date && userData.carte_national_expiry_date.trim() !== '' ? userData.carte_national_expiry_date : null,
        driver_license_start_date: userData.driver_license_start_date && userData.driver_license_start_date.trim() !== '' ? userData.driver_license_start_date : null,
        driver_license_expiry_date: userData.driver_license_expiry_date && userData.driver_license_expiry_date.trim() !== '' ? userData.driver_license_expiry_date : null,
        driver_license_category: userData.driver_license_category || null,
        driver_license_category_dates: userData.driver_license_category_dates || null,
        blood_type: userData.blood_type && userData.blood_type.trim() !== '' ? userData.blood_type : null,
        company_assignment_date: userData.company_assignment_date && userData.company_assignment_date.trim() !== '' ? userData.company_assignment_date : null,
      };

      // Only update email if it's provided
      if (userData.email !== undefined) {
        updateData.email = userData.email && userData.email.trim() !== '' ? userData.email : null;
      }
      
      // Only update profile_image if it's provided
      if (userData.profile_image !== undefined) {
        updateData.profile_image = userData.profile_image;
      }
      
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', numericId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateUsers();
      toast({
        title: 'Succès',
        description: 'Utilisateur modifié avec succès',
      });
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier l\'utilisateur',
        variant: 'destructive',
      });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId: string) => {
      const numericId = parseInt(userId, 10);
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', numericId);

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateUsers();
      toast({
        title: 'Succès',
        description: 'Utilisateur supprimé avec succès',
      });
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'utilisateur',
        variant: 'destructive',
      });
    },
  });

  return {
    updateUser,
    deleteUser,
    invalidateUsers,
  };
};

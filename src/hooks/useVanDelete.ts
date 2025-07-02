
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Van } from '@/types/van';

export const useVanDelete = (onDeleteSuccess?: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [vanToDelete, setVanToDelete] = useState<Van | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const deleteVan = async (van: Van) => {
    console.log('🚐 useVanDelete: Starting delete process for van:', van);
    setVanToDelete(van);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!vanToDelete) return;
    
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('vans')
        .delete()
        .eq('id', vanToDelete.id);

      if (error) {
        console.error('Error deleting van:', error);
        toast({
          title: t.error,
          description: "Impossible de supprimer la camionnette",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: t.success,
        description: `La camionnette ${vanToDelete.license_plate || vanToDelete.reference_code} a été supprimée avec succès`,
      });

      setIsDeleteDialogOpen(false);
      setVanToDelete(null);
      onDeleteSuccess?.();
    } catch (error) {
      console.error('Error deleting van:', error);
      toast({
        title: t.error,
        description: "Une erreur s'est produite lors de la suppression",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteVan,
    confirmDelete,
    isDeleting,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    vanToDelete,
  };
};

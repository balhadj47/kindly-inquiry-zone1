
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const useVanDelete = (onDeleteSuccess?: () => void) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const deleteVan = async (van: any) => {
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('vans')
        .delete()
        .eq('id', van.id);

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
        description: `La camionnette ${van.license_plate || van.reference_code} a été supprimée avec succès`,
      });

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
    isDeleting,
  };
};

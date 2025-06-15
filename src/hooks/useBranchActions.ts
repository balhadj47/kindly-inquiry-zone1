
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBranchActions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteBranch = async (branchId: string): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('Deleting branch:', branchId);

      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', branchId);

      if (error) {
        console.error('Error deleting branch:', error);
        throw error;
      }

      console.log('Branch deleted successfully');
      toast.success('Branch deleted successfully');
    } catch (error) {
      console.error('Error in deleteBranch:', error);
      toast.error('Error deleting branch');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteBranch,
    isLoading
  };
};

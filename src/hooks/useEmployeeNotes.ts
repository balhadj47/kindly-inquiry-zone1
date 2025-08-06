
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EmployeeNote {
  id: string;
  employee_id: number;
  date: string;
  category: string;
  title: string;
  details?: string;
  created_at: string;
  created_by?: string;
}

export interface CreateEmployeeNoteData {
  employee_id: number;
  date: string;
  category: string;
  title: string;
  details?: string | null;
}

export const useEmployeeNotes = (employeeId: number) => {
  return useQuery({
    queryKey: ['employee-notes', employeeId],
    queryFn: async (): Promise<EmployeeNote[]> => {
      console.log('🔍 Fetching employee notes for employee ID:', employeeId);
      
      // Direct query to employee_notes table
      const { data, error } = await supabase
        .from('employee_notes' as any)
        .select('*')
        .eq('employee_id', employeeId)
        .order('date', { ascending: false });

      if (error) {
        console.error('❌ Error fetching employee notes:', error);
        throw new Error(`Failed to fetch employee notes: ${error.message}`);
      }

      console.log('✅ Successfully fetched employee notes:', data?.length || 0);
      return data || [];
    },
    enabled: !!employeeId && !isNaN(employeeId),
  });
};

export const useEmployeeNotesMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createNote = useMutation({
    mutationFn: async (noteData: CreateEmployeeNoteData): Promise<EmployeeNote> => {
      console.log('➕ Creating employee note:', noteData);
      
      const { data, error } = await supabase
        .from('employee_notes' as any)
        .insert(noteData)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating employee note:', error);
        throw new Error(`Failed to create employee note: ${error.message}`);
      }

      console.log('✅ Successfully created employee note:', data.id);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['employee-notes', data.employee_id] 
      });
    },
    onError: (error) => {
      console.error('❌ Create employee note mutation failed:', error);
    }
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<CreateEmployeeNoteData>): Promise<EmployeeNote> => {
      console.log('✏️ Updating employee note:', id, updates);
      
      const { data, error } = await supabase
        .from('employee_notes' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating employee note:', error);
        throw new Error(`Failed to update employee note: ${error.message}`);
      }

      console.log('✅ Successfully updated employee note:', data.id);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ 
        queryKey: ['employee-notes', data.employee_id] 
      });
    },
    onError: (error) => {
      console.error('❌ Update employee note mutation failed:', error);
    }
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string): Promise<void> => {
      console.log('🗑️ Deleting employee note:', id);
      
      const { error } = await supabase
        .from('employee_notes' as any)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting employee note:', error);
        throw new Error(`Failed to delete employee note: ${error.message}`);
      }

      console.log('✅ Successfully deleted employee note:', id);
    },
    onSuccess: () => {
      // Invalidate all employee notes queries since we don't know which employee this belonged to
      queryClient.invalidateQueries({ queryKey: ['employee-notes'] });
      toast({
        title: 'Succès',
        description: 'Note supprimée avec succès',
      });
    },
    onError: (error) => {
      console.error('❌ Delete employee note mutation failed:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la note',
        variant: 'destructive',
      });
    }
  });

  return {
    createNote,
    updateNote,
    deleteNote,
  };
};

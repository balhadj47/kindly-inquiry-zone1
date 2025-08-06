
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
      
      try {
        // Use SQL query to work around type issues
        const { data, error } = await supabase
          .rpc('execute_sql', {
            query: `
              SELECT id::text, employee_id, date, category, title, details, created_at::text, created_by
              FROM employee_notes 
              WHERE employee_id = $1 
              ORDER BY date DESC, created_at DESC
            `,
            params: [employeeId]
          });

        if (error) {
          console.error('❌ Error fetching employee notes:', error);
          throw new Error(`Failed to fetch employee notes: ${error.message}`);
        }

        console.log('✅ Successfully fetched employee notes:', data?.length || 0);
        return data || [];
      } catch (error) {
        console.error('❌ Error in employee notes query:', error);
        // Return empty array as fallback
        return [];
      }
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
      
      try {
        const { data, error } = await supabase
          .rpc('execute_sql', {
            query: `
              INSERT INTO employee_notes (employee_id, date, category, title, details)
              VALUES ($1, $2, $3, $4, $5)
              RETURNING id::text, employee_id, date, category, title, details, created_at::text, created_by
            `,
            params: [
              noteData.employee_id,
              noteData.date,
              noteData.category,
              noteData.title,
              noteData.details || null
            ]
          });

        if (error) {
          console.error('❌ Error creating employee note:', error);
          throw new Error(`Failed to create employee note: ${error.message}`);
        }

        if (!data || data.length === 0) {
          throw new Error('No data returned from create operation');
        }

        console.log('✅ Successfully created employee note:', data[0].id);
        return data[0];
      } catch (error) {
        console.error('❌ Error in create note mutation:', error);
        throw error;
      }
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
      
      try {
        // Build dynamic update query
        const setClause = Object.keys(updates)
          .map((key, index) => `${key} = $${index + 2}`)
          .join(', ');
        
        const params = [id, ...Object.values(updates)];
        
        const { data, error } = await supabase
          .rpc('execute_sql', {
            query: `
              UPDATE employee_notes 
              SET ${setClause}
              WHERE id = $1
              RETURNING id::text, employee_id, date, category, title, details, created_at::text, created_by
            `,
            params: params
          });

        if (error) {
          console.error('❌ Error updating employee note:', error);
          throw new Error(`Failed to update employee note: ${error.message}`);
        }

        if (!data || data.length === 0) {
          throw new Error('No data returned from update operation');
        }

        console.log('✅ Successfully updated employee note:', data[0].id);
        return data[0];
      } catch (error) {
        console.error('❌ Error in update note mutation:', error);
        throw error;
      }
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
      
      try {
        const { error } = await supabase
          .rpc('execute_sql', {
            query: 'DELETE FROM employee_notes WHERE id = $1',
            params: [id]
          });

        if (error) {
          console.error('❌ Error deleting employee note:', error);
          throw new Error(`Failed to delete employee note: ${error.message}`);
        }

        console.log('✅ Successfully deleted employee note:', id);
      } catch (error) {
        console.error('❌ Error in delete note mutation:', error);
        throw error;
      }
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

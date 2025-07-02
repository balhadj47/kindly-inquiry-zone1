
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  status: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, phone, status')
        .eq('status', 'Active')
        .order('name');

      if (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
        return;
      }

      setUsers(data || []);
    } catch (err) {
      console.error('Exception fetching users:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
};

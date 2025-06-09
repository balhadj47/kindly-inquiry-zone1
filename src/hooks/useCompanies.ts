
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Company {
  id: string;
  name: string;
  created_at: string;
  updated_at?: string;
  branches: Branch[];
}

export interface Branch {
  id: string;
  name: string;
  company_id: string;
  created_at: string;
  updated_at?: string;
}

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching companies...');
      
      // Fetch companies
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (companiesError) {
        console.error('Companies error:', companiesError);
        throw companiesError;
      }

      // Fetch branches
      const { data: branchesData, error: branchesError } = await supabase
        .from('branches')
        .select('*')
        .order('name', { ascending: true });

      if (branchesError) {
        console.error('Branches error:', branchesError);
        throw branchesError;
      }

      console.log('Fetched companies:', companiesData);
      console.log('Fetched branches:', branchesData);

      // Group branches by company
      const companiesWithBranches = (companiesData || []).map((company: any) => ({
        ...company,
        branches: (branchesData || []).filter((branch: any) => branch.company_id === company.id)
      }));

      setCompanies(companiesWithBranches);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return { 
    companies, 
    setCompanies,
    loading, 
    error, 
    refetch: fetchCompanies 
  };
};


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Company {
  id: string;
  name: string;
  branches: Branch[];
}

export interface Branch {
  id: string;
  name: string;
  company_id: string;
}

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        
        // Fetch companies
        const { data: companiesData, error: companiesError } = await supabase
          .from('companies')
          .select('*');

        if (companiesError) throw companiesError;

        // Fetch branches
        const { data: branchesData, error: branchesError } = await supabase
          .from('branches')
          .select('*');

        if (branchesError) throw branchesError;

        // Group branches by company
        const companiesWithBranches = companiesData.map(company => ({
          ...company,
          branches: branchesData.filter(branch => branch.company_id === company.id)
        }));

        setCompanies(companiesWithBranches);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return { companies, loading, error };
};

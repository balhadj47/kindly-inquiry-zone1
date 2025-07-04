
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Company, Branch } from './useCompanies';

export const useCompaniesActions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createCompany = async (companyData: { 
    name: string; 
    address?: string; 
    phone?: string; 
    email?: string; 
    branches: string[] 
  }) => {
    setIsLoading(true);
    try {
      console.log('Creating company:', companyData);

      // Create the company first
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: companyData.name,
          address: companyData.address || null,
          phone: companyData.phone || null,
          email: companyData.email || null
        })
        .select()
        .single();

      if (companyError) {
        console.error('Error creating company:', companyError);
        throw companyError;
      }

      console.log('Company created:', company);

      // Create branches if any
      if (companyData.branches.length > 0) {
        const branchInserts = companyData.branches.map(branchName => ({
          name: branchName,
          company_id: company.id
        }));

        const { error: branchError } = await supabase
          .from('branches')
          .insert(branchInserts);

        if (branchError) {
          console.error('Error creating branches:', branchError);
          throw branchError;
        }

        console.log('Branches created successfully');
      }

      return company;
    } catch (error) {
      console.error('Error in createCompany:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCompany = async (companyId: string, companyData: { 
    name: string; 
    address?: string; 
    phone?: string; 
    email?: string; 
    branches: string[] 
  }) => {
    setIsLoading(true);
    try {
      console.log('Updating company:', companyId, companyData);

      // Update the company
      const { error: companyError } = await supabase
        .from('companies')
        .update({ 
          name: companyData.name,
          address: companyData.address || null,
          phone: companyData.phone || null,
          email: companyData.email || null
        })
        .eq('id', companyId);

      if (companyError) {
        console.error('Error updating company:', companyError);
        throw companyError;
      }

      // Delete existing branches
      const { error: deleteError } = await supabase
        .from('branches')
        .delete()
        .eq('company_id', companyId);

      if (deleteError) {
        console.error('Error deleting existing branches:', deleteError);
        throw deleteError;
      }

      // Create new branches
      if (companyData.branches.length > 0) {
        const branchInserts = companyData.branches.map(branchName => ({
          name: branchName,
          company_id: companyId
        }));

        const { error: branchError } = await supabase
          .from('branches')
          .insert(branchInserts);

        if (branchError) {
          console.error('Error creating new branches:', branchError);
          throw branchError;
        }
      }

      console.log('Company updated successfully');
    } catch (error) {
      console.error('Error in updateCompany:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCompany = async (companyId: string): Promise<void> => {
    setIsLoading(true);
    try {
      console.log('Deleting company:', companyId);

      // First delete all branches associated with the company
      const { error: branchError } = await supabase
        .from('branches')
        .delete()
        .eq('company_id', companyId);

      if (branchError) {
        console.error('Error deleting branches:', branchError);
        throw branchError;
      }

      // Then delete the company
      const { error: companyError } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (companyError) {
        console.error('Error deleting company:', companyError);
        throw companyError;
      }

      console.log('Company deleted successfully');
    } catch (error) {
      console.error('Error in deleteCompany:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCompany,
    updateCompany,
    deleteCompany,
    isLoading
  };
};

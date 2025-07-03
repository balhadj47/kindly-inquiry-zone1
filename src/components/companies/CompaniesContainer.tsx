
import React, { useState } from 'react';
import CompaniesHeader from './CompaniesHeader';
import CompaniesSearch from './CompaniesSearch';
import CompaniesEmptyState from './CompaniesEmptyState';
import CompaniesGrid from './CompaniesGrid';
import CompanyModal from '../CompanyModal';
import CompanyDeleteDialog from '../CompanyDeleteDialog';
import CompaniesErrorState from './CompaniesErrorState';
import { useAllCompaniesWithBranches, useCompanyMutations } from '@/hooks/useCompaniesOptimized';
import { useCompaniesState } from '@/hooks/useCompaniesState';

const CompaniesContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 12;
  
  // Add error boundary for data fetching
  const { data: companies = [], refetch, error } = useAllCompaniesWithBranches();
  const { invalidateCompanies } = useCompanyMutations();
  
  // Safe setter function with proper error handling
  const setCompanies = React.useCallback(() => {
    try {
      console.log('📊 Companies: Invalidating companies cache');
      invalidateCompanies();
    } catch (error) {
      console.error('❌ Companies: Error invalidating companies:', error);
    }
  }, [invalidateCompanies]);

  const {
    isModalOpen,
    setIsModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedCompany,
    isDeleting,
    handleAddCompany,
    handleEditCompany,
    handleDeleteCompany,
    handleConfirmDelete
  } = useCompaniesState(setCompanies);

  // Enhanced filtering with comprehensive error handling
  const filteredCompanies = React.useMemo(() => {
    try {
      if (!companies) {
        console.warn('⚠️ Companies: Companies data is null/undefined');
        return [];
      }
      
      if (!Array.isArray(companies)) {
        console.warn('⚠️ Companies: Companies data is not an array:', typeof companies, companies);
        return [];
      }
      
      return companies.filter(company => {
        // Comprehensive null checks
        if (!company) {
          console.warn('⚠️ Companies: Null company object found');
          return false;
        }
        
        if (typeof company !== 'object') {
          console.warn('⚠️ Companies: Invalid company object type:', typeof company);
          return false;
        }
        
        if (!company.name || typeof company.name !== 'string') {
          console.warn('⚠️ Companies: Company missing or invalid name:', company);
          return false;
        }
        
        try {
          return company.name.toLowerCase().includes((searchTerm || '').toLowerCase());
        } catch (filterError) {
          console.error('❌ Companies: Error filtering company:', filterError, company);
          return false;
        }
      });
    } catch (error) {
      console.error('❌ Companies: Critical error in filtering:', error);
      return [];
    }
  }, [companies, searchTerm]);

  const hasActiveFilters = searchTerm && searchTerm.length > 0;

  const clearFilters = () => {
    try {
      setSearchTerm('');
      setCurrentPage(1);
    } catch (error) {
      console.error('❌ Companies: Error clearing filters:', error);
    }
  };

  const handlePageChange = (page: number) => {
    try {
      if (typeof page === 'number' && page > 0) {
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('❌ Companies: Error changing page:', error);
    }
  };

  const handleModalSubmit = async (companyData: any) => {
    try {
      console.log('✅ Companies: Modal submit, refreshing data');
      await refetch();
      invalidateCompanies();
      setIsModalOpen(false);
    } catch (error) {
      console.error('❌ Companies: Error refreshing after modal submit:', error);
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) {
      console.log('🔄 Companies: Refresh already in progress');
      return;
    }
    
    setIsRefreshing(true);
    console.log('🔄 Companies: Starting manual refresh');
    
    try {
      await refetch();
      invalidateCompanies();
      console.log('✅ Companies: Manual refresh completed');
    } catch (error) {
      console.error('❌ Companies: Error during refresh:', error);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        console.log('🔄 Companies: Refresh state reset');
      }, 500);
    }
  };

  // Placeholder for adding branch functionality
  const handleAddBranch = (company: any) => {
    console.log('Add branch for company:', company);
    // TODO: Implement branch creation functionality
  };

  // Enhanced error state handling
  if (error) {
    console.error('❌ Companies: Fetch error:', error);
    return (
      <CompaniesErrorState
        onAdd={handleAddCompany}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <CompaniesHeader 
        onAdd={handleAddCompany} 
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      
      <CompaniesSearch 
        searchTerm={searchTerm || ''} 
        setSearchTerm={setSearchTerm}
        companiesCount={filteredCompanies.length}
        totalCount={companies.length}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      {filteredCompanies.length === 0 ? (
        <CompaniesEmptyState 
          searchTerm={searchTerm || ''} 
          onAddCompany={handleAddCompany} 
        />
      ) : (
        <CompaniesGrid
          companies={filteredCompanies}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          onEditCompany={handleEditCompany}
          onDeleteCompany={handleDeleteCompany}
          onAddBranch={handleAddBranch}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        company={selectedCompany}
        onSubmit={handleModalSubmit}
      />

      <CompanyDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        company={selectedCompany}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default CompaniesContainer;

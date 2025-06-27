
import React, { useState } from 'react';
import CompaniesHeader from './CompaniesHeader';
import CompaniesSearch from './CompaniesSearch';
import CompaniesEmptyState from './CompaniesEmptyState';
import CompaniesGrid from './CompaniesGrid';
import CompanyModal from '../CompanyModal';
import CompanyDeleteDialog from '../CompanyDeleteDialog';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAllCompaniesWithBranches, useCompanyMutations } from '@/hooks/useCompaniesOptimized';
import { useCompaniesState } from '@/hooks/useCompaniesState';

const CompaniesIndex = () => {
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

  const handleModalSuccess = () => {
    try {
      console.log('✅ Companies: Modal success, refreshing data');
      refetch();
      invalidateCompanies();
    } catch (error) {
      console.error('❌ Companies: Error refreshing after modal success:', error);
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

  // Enhanced error state handling
  if (error) {
    console.error('❌ Companies: Fetch error:', error);
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <CompaniesHeader onAddCompany={handleAddCompany} />
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">Impossible de charger les entreprises</p>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? 'Chargement...' : 'Réessayer'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <CompaniesHeader onAddCompany={handleAddCompany} />
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>
      
      <CompaniesSearch 
        searchTerm={searchTerm || ''} 
        onSearchChange={setSearchTerm} 
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
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}

      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        company={selectedCompany}
        onSuccess={handleModalSuccess}
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

export default CompaniesIndex;

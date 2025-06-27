
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
  const { data: companies = [], refetch, error } = useAllCompaniesWithBranches();
  const { invalidateCompanies } = useCompanyMutations();
  
  // Fixed: Create a proper setter function that works with the existing hook
  const setCompanies = React.useCallback(() => {
    try {
      invalidateCompanies();
    } catch (error) {
      console.error('Error invalidating companies:', error);
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

  // Safe filtering with proper null checks
  const filteredCompanies = React.useMemo(() => {
    if (!Array.isArray(companies)) {
      console.warn('Companies data is not an array:', companies);
      return [];
    }
    
    return companies.filter(company => {
      if (!company || typeof company.name !== 'string') {
        console.warn('Invalid company object:', company);
        return false;
      }
      return company.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [companies, searchTerm]);

  const hasActiveFilters = searchTerm.length > 0;

  const clearFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleModalSuccess = () => {
    try {
      refetch();
      invalidateCompanies();
    } catch (error) {
      console.error('Error refreshing after modal success:', error);
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await refetch();
      invalidateCompanies();
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Handle error state
  if (error) {
    console.error('Companies fetch error:', error);
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
          <Button onClick={handleRefresh}>Réessayer</Button>
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
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      {filteredCompanies.length === 0 ? (
        <CompaniesEmptyState 
          searchTerm={searchTerm} 
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

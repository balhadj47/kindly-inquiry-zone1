
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
  const { data: companies = [], refetch } = useAllCompaniesWithBranches();
  const { invalidateCompanies } = useCompanyMutations();
  
  // Create a setter function that works with the existing hook
  const setCompanies = () => {
    invalidateCompanies();
  };

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

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hasActiveFilters = searchTerm.length > 0;

  const clearFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleModalSuccess = () => {
    refetch();
    invalidateCompanies();
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await refetch();
      invalidateCompanies();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <CompaniesHeader onAddCompany={handleAddCompany} />
        <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" size="icon">
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
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

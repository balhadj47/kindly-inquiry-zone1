
import React, { useState } from 'react';
import CompaniesHeader from './CompaniesHeader';
import CompaniesSearch from './CompaniesSearch';
import CompaniesEmptyState from './CompaniesEmptyState';
import CompaniesGrid from './CompaniesGrid';
import CompanyModal from '../CompanyModal';
import CompanyDeleteDialog from '../CompanyDeleteDialog';
import { useAllCompaniesWithBranches, useCompanyMutations } from '@/hooks/useCompaniesOptimized';
import { useCompaniesState } from '@/hooks/useCompaniesState';

const CompaniesIndex = () => {
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleModalSuccess = () => {
    refetch();
    invalidateCompanies();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <CompaniesHeader onAddCompany={handleAddCompany} />
      
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
          onEditCompany={handleEditCompany}
          onDeleteCompany={handleDeleteCompany}
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

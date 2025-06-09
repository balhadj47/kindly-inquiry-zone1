
import React, { useState } from 'react';
import CompaniesHeader from './companies/CompaniesHeader';
import CompaniesSearch from './companies/CompaniesSearch';
import CompaniesEmptyState from './companies/CompaniesEmptyState';
import CompaniesGrid from './companies/CompaniesGrid';
import CompanyModal from './CompanyModal';
import CompanyDeleteDialog from './CompanyDeleteDialog';
import { useCompanies } from '@/hooks/useCompanies';
import { useCompaniesState } from '@/hooks/useCompaniesState';

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { companies, loading, error, refetch, setCompanies } = useCompanies();
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
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des entreprises...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Erreur: {error}</div>
      </div>
    );
  }

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

export default Companies;

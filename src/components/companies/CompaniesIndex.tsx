
import React, { useState } from 'react';
import CompaniesHeader from './CompaniesHeader';
import CompaniesSearch from './CompaniesSearch';
import CompaniesEmptyState from './CompaniesEmptyState';
import CompaniesGrid from './CompaniesGrid';
import CompanyModal from '../CompanyModal';
import CompanyDeleteDialog from '../CompanyDeleteDialog';
import CompanyDetailDialog from './CompanyDetailDialog';
import { useCompanies } from '@/hooks/useCompanies';
import { useCompaniesState } from '@/hooks/useCompaniesState';
// Remove useNavigate, useParams imports (not needed with prompt)

const CompaniesIndex = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { companies, refetch, setCompanies } = useCompanies();
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

  // State for details dialog
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailDialogCompany, setDetailDialogCompany] = useState<null | (typeof companies)[0]>(null);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleModalSuccess = () => {
    refetch();
  };

  // Handle card click: open dialog, set company
  const handleShowCompanyDetail = (company: typeof companies[0]) => {
    setDetailDialogCompany(company);
    setDetailDialogOpen(true);
  };

  // Branch click could be handled later if you want nested dialogs/prompts

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
          onShowCompanyDetail={handleShowCompanyDetail}
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

      <CompanyDetailDialog
        company={detailDialogCompany}
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
      />
    </div>
  );
};

export default CompaniesIndex;



import React, { useState } from 'react';
import CompaniesHeader from './CompaniesHeader';
import CompaniesSearch from './CompaniesSearch';
import CompaniesEmptyState from './CompaniesEmptyState';
import CompaniesGrid from './CompaniesGrid';
import CompanyModal from '../CompanyModal';
import CompanyDeleteDialog from '../CompanyDeleteDialog';
import CompanyDetailDialog from './CompanyDetailDialog';
import BranchDetailDialog from './BranchDetailDialog';
import { useCompanies } from '@/hooks/useCompanies';
import { useCompaniesState } from '@/hooks/useCompaniesState';

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

  // State for details dialogs
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailDialogCompany, setDetailDialogCompany] = useState<null | (typeof companies)[0]>(null);
  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<null | (typeof companies)[0]['branches'][0]>(null);

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

  // Handle branch click from company dialog
  const handleBranchClick = (branchId: string) => {
    if (!detailDialogCompany) return;
    
    const branch = detailDialogCompany.branches.find(b => b.id === branchId);
    if (branch) {
      setSelectedBranch(branch);
      setDetailDialogOpen(false);
      setBranchDialogOpen(true);
    }
  };

  // Handle back to company from branch dialog
  const handleBackToCompany = () => {
    setBranchDialogOpen(false);
    setDetailDialogOpen(true);
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
        onBranchClick={handleBranchClick}
      />

      <BranchDetailDialog
        branch={selectedBranch}
        company={detailDialogCompany}
        open={branchDialogOpen}
        onClose={() => setBranchDialogOpen(false)}
        onBackToCompany={handleBackToCompany}
      />
    </div>
  );
};

export default CompaniesIndex;

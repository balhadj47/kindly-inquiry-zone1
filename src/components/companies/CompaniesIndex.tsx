import React, { useState, useEffect } from 'react';
import { useCompanies, Company } from '@/hooks/useCompanies';
import { useCompaniesActions } from '@/hooks/useCompaniesActions';
import { useCommonActions } from '@/hooks/useCommonActions';
import CompaniesHeader from './CompaniesHeader';
import CompaniesSearch from './CompaniesSearch';
import CompaniesGrid from './CompaniesGrid';
import CompanyModal from '@/components/CompanyModal';
import CompanyDeleteDialog from '@/components/CompanyDeleteDialog';
import { useToast } from '@/hooks/use-toast';

const CompaniesIndex = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data: companies = [], isLoading, error, refetch } = useCompanies();
  const { createCompany, updateCompany, deleteCompany } = useCompaniesActions();
  const { isRefreshing, handleRefresh } = useCommonActions({
    refetch,
    refreshKeys: ['companies']
  });
  const { toast } = useToast();

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.branches?.some(branch => 
      branch.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const hasActiveFilters = searchTerm !== '';

  const clearFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsCompanyModalOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsCompanyModalOpen(true);
  };

  const handleDeleteCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const handleAddBranch = (company: Company) => {
    // This functionality would need to be implemented
    console.log('Add branch for company:', company.name);
  };

  const handleCompanySubmit = async (companyData: any) => {
    try {
      if (selectedCompany) {
        await updateCompany(selectedCompany.id, companyData);
        toast({
          title: 'Entreprise modifiée',
          description: 'L\'entreprise a été modifiée avec succès.',
        });
      } else {
        await createCompany(companyData);
        toast({
          title: 'Entreprise créée',
          description: 'L\'entreprise a été créée avec succès.',
        });
      }
      setIsCompanyModalOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'opération.',
        variant: 'destructive',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCompany) return;
    
    try {
      await deleteCompany(selectedCompany.id);
      toast({
        title: 'Entreprise supprimée',
        description: 'L\'entreprise a été supprimée avec succès.',
      });
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement des entreprises</div>;
  }

  return (
    <div className="space-y-6">
      <CompaniesHeader 
        onAdd={handleAddCompany}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      
      <CompaniesSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        companiesCount={filteredCompanies.length}
        totalCount={companies.length}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      <CompaniesGrid
        companies={filteredCompanies}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
        onEditCompany={handleEditCompany}
        onDeleteCompany={handleDeleteCompany}
        onAddBranch={handleAddBranch}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onSubmit={handleCompanySubmit}
        company={selectedCompany}
      />

      <CompanyDeleteDialog
        isOpen={isDeleteDialogOpen}
        company={selectedCompany}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default CompaniesIndex;

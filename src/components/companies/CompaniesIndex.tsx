
import React, { useState } from 'react';
import { useCompanies, Company } from '@/hooks/useCompanies';
import { useCompaniesActions } from '@/hooks/useCompaniesActions';
import { useCommonActions } from '@/hooks/useCommonActions';
import CompaniesHeader from './CompaniesHeader';
import CompaniesSearch from './CompaniesSearch';
import CompaniesGrid from './CompaniesGrid';
import CompanyModal from '@/components/CompanyModal';
import CompanyDeleteDialog from '@/components/CompanyDeleteDialog';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const CompaniesLoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-32" />
    </div>
    <Skeleton className="h-12 w-full" />
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full" />
      ))}
    </div>
  </div>
);

const CompaniesErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center h-64 space-y-4">
    <h3 className="text-lg font-semibold text-gray-900">Erreur de chargement</h3>
    <p className="text-gray-600">Impossible de charger les entreprises</p>
    <button 
      onClick={onRetry}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Réessayer
    </button>
  </div>
);

const CompaniesIndex = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const { data: companies = [], isLoading, error, refetch } = useCompanies();
  const { createCompany, updateCompany, deleteCompany } = useCompaniesActions();
  const { isRefreshing, handleRefresh } = useCommonActions({
    refetch,
    refreshKeys: ['companies']
  });
  const { toast } = useToast();

  // Simple filtering for better performance
  const filteredCompanies = React.useMemo(() => {
    if (!searchTerm) return companies;
    const term = searchTerm.toLowerCase();
    return companies.filter(company =>
      company.name.toLowerCase().includes(term) ||
      company.address?.toLowerCase().includes(term) ||
      company.branches?.some(branch => 
        branch.name.toLowerCase().includes(term)
      )
    );
  }, [companies, searchTerm]);

  const hasActiveFilters = searchTerm !== '';

  const clearFilters = () => {
    setSearchTerm('');
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
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <CompaniesLoadingSkeleton />;
  }

  if (error) {
    return <CompaniesErrorState onRetry={() => refetch()} />;
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
        onAddBranch={() => {}} // Placeholder
        currentPage={1}
        itemsPerPage={50}
        onPageChange={() => {}}
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
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default CompaniesIndex;

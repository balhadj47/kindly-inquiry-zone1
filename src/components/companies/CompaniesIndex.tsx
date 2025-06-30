
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import { useRBAC } from '@/contexts/RBACContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CompaniesLoadingSkeleton from './CompaniesLoadingSkeleton';
import CompaniesErrorState from './CompaniesErrorState';
import CompaniesEmptyState from './CompaniesEmptyState';
import CompaniesHeader from './CompaniesHeader';
import CompaniesSearch from './CompaniesSearch';
import CompaniesGrid from './CompaniesGrid';
import CompanyModal from '../CompanyModal';
import CompanyDeleteDialog from '../CompanyDeleteDialog';
import CompanyDetailDialog from './CompanyDetailDialog';
import BranchModal from './BranchModal';
import { Company } from '@/hooks/useCompanies';

const CompaniesIndex = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { hasPermission } = useRBAC();
  const { data: companies = [], isLoading, isError, refetch } = useCompanies();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debug companies data when it changes
  useEffect(() => {
    if (companies && companies.length > 0) {
      console.log('🏢 CompaniesIndex: Companies data received:', {
        totalCompanies: companies.length,
        companiesWithBranches: companies.filter(c => c.branches && c.branches.length > 0).length,
        detailedData: companies.map(c => ({
          id: c.id,
          name: c.name,
          branchCount: c.branches?.length || 0,
          branches: c.branches?.map(b => ({ id: b.id, name: b.name })) || []
        }))
      });
    } else {
      console.log('🏢 CompaniesIndex: No companies data or empty array');
    }
  }, [companies]);

  // Filter companies based on search
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Permission checks
  const canCreateCompanies = hasPermission('companies:create');

  // Event handlers
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

  const handleConfirmDelete = async () => {
    if (!selectedCompany) return;
    
    setIsDeleting(true);
    try {
      // TODO: Implement actual delete logic here
      console.log('Deleting company:', selectedCompany.id);
      // await deleteCompany(selectedCompany.id);
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error deleting company:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company);
    setIsDetailDialogOpen(true);
  };

  const handleAddBranch = (company: Company) => {
    setSelectedCompany(company);
    setIsBranchModalOpen(true);
  };

  const handleBranchClick = (branchId: string) => {
    navigate(`/companies/branch/${branchId}`);
  };

  const handleModalSuccess = () => {
    refetch();
  };

  // Loading state
  if (isLoading) {
    return <CompaniesLoadingSkeleton />;
  }

  // Error state
  if (isError) {
    return (
      <CompaniesErrorState 
        onAdd={handleAddCompany}
        onRefresh={refetch}
        isRefreshing={isLoading}
      />
    );
  }

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <CompaniesHeader 
        onAdd={handleAddCompany}
        onRefresh={refetch}
        isRefreshing={isLoading}
      />

      {/* Search */}
      <CompaniesSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Debug Console Output */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs space-y-1">
          <div><strong>Debug Info:</strong></div>
          <div>Total companies: {companies.length}</div>
          <div>Companies with branches: {companies.filter(c => c.branches && c.branches.length > 0).length}</div>
          <div>Total branches across all companies: {companies.reduce((sum, c) => sum + (c.branches?.length || 0), 0)}</div>
          {companies.length > 0 && (
            <div className="mt-2">
              <strong>First company example:</strong>
              <pre className="text-xs bg-white p-2 rounded mt-1">
                {JSON.stringify({
                  name: companies[0].name,
                  branchCount: companies[0].branches?.length || 0,
                  branches: companies[0].branches?.map(b => b.name) || []
                }, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {filteredCompanies.length === 0 && searchTerm ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune entreprise ne correspond à votre recherche</p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <CompaniesEmptyState 
          onAddCompany={canCreateCompanies ? handleAddCompany : undefined}
          searchTerm={searchTerm}
        />
      ) : (
        <CompaniesGrid
          companies={filteredCompanies}
          hasActiveFilters={!!searchTerm}
          clearFilters={() => setSearchTerm('')}
          onEditCompany={handleEditCompany}
          onDeleteCompany={handleDeleteCompany}
          onAddBranch={handleAddBranch}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modals */}
      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
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
        company={selectedCompany}
        open={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        onBranchClick={handleBranchClick}
      />

      <BranchModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        branch={null}
        companyId={selectedCompany?.id || ''}
        companyName={selectedCompany?.name || ''}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default CompaniesIndex;

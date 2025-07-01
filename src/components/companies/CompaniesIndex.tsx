
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useCompanies } from '@/hooks/useCompanies';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
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
  const permissions = useSecurePermissions();
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

  // Filter companies based on search
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // STRICT Permission checks - only allow actions if user has explicit permissions
  const canCreateCompanies = permissions.canCreateCompanies === true;
  const canEditCompanies = permissions.canUpdateCompanies === true;
  const canDeleteCompanies = permissions.canDeleteCompanies === true;
  const canReadCompanies = permissions.canReadCompanies === true;

  // Debug permissions for view-only users
  React.useEffect(() => {
    console.log('🔒 CompaniesIndex: Current user permissions:', {
      canReadCompanies,
      canCreateCompanies,
      canEditCompanies,
      canDeleteCompanies,
      currentUser: permissions.currentUser,
      isAdmin: permissions.isAdmin
    });
  }, [permissions]);

  // Event handlers with strict permission checking
  const handleAddCompany = () => {
    if (!canCreateCompanies) {
      console.log('❌ Cannot add company - permission denied');
      return;
    }
    setSelectedCompany(null);
    setIsCompanyModalOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    if (!canEditCompanies) {
      console.log('❌ Cannot edit company - permission denied');
      return;
    }
    setSelectedCompany(company);
    setIsCompanyModalOpen(true);
  };

  const handleDeleteCompany = (company: Company) => {
    if (!canDeleteCompanies) {
      console.log('❌ Cannot delete company - permission denied');
      return;
    }
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCompany || !canDeleteCompanies) return;
    
    setIsDeleting(true);
    try {
      // TODO: Implement actual delete logic here
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
    if (!canCreateCompanies) {
      console.log('❌ Cannot add branch - permission denied');
      return;
    }
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
        onAdd={canCreateCompanies ? handleAddCompany : undefined}
        onRefresh={refetch}
        isRefreshing={isLoading}
      />
    );
  }

  // Check if user can read companies
  if (!canReadCompanies) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour voir les entreprises.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <CompaniesHeader 
        onAdd={canCreateCompanies ? handleAddCompany : undefined}
        onRefresh={refetch}
        isRefreshing={isLoading}
      />

      {/* Search */}
      <CompaniesSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

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
          onEditCompany={canEditCompanies ? handleEditCompany : undefined}
          onDeleteCompany={canDeleteCompanies ? handleDeleteCompany : undefined}
          onAddBranch={canCreateCompanies ? handleAddBranch : undefined}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modals - Only render if user has permissions */}
      {(canCreateCompanies || canEditCompanies) && (
        <CompanyModal
          isOpen={isCompanyModalOpen}
          onClose={() => setIsCompanyModalOpen(false)}
          company={selectedCompany}
          onSuccess={handleModalSuccess}
        />
      )}

      {canDeleteCompanies && (
        <CompanyDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          company={selectedCompany}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      )}

      <CompanyDetailDialog
        company={selectedCompany}
        open={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        onBranchClick={handleBranchClick}
      />

      {canCreateCompanies && (
        <BranchModal
          isOpen={isBranchModalOpen}
          onClose={() => setIsBranchModalOpen(false)}
          branch={null}
          companyId={selectedCompany?.id || ''}
          companyName={selectedCompany?.name || ''}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default CompaniesIndex;

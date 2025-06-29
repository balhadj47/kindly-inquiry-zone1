
import React, { useState } from 'react';
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

  // Filter companies based on search
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Debug log to see what data we're getting
  console.log('🏢 CompaniesIndex: Rendering with data:', {
    totalCompanies: companies.length,
    filteredCompanies: filteredCompanies.length,
    companiesWithBranches: companies.map(c => ({
      name: c.name,
      branchCount: c.branches?.length || 0,
      branches: c.branches?.map(b => b.name) || []
    }))
  });

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
    return <CompaniesErrorState onRetry={refetch} />;
  }

  return (
    <div className="space-y-6 py-8">
      {/* Header */}
      <CompaniesHeader 
        totalCount={companies.length}
        canCreate={canCreateCompanies}
        onAddCompany={handleAddCompany}
      />

      {/* Search */}
      <CompaniesSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Debug Info - Remove this in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs">
          <strong>Debug Info:</strong> Found {companies.length} companies with {companies.reduce((sum, c) => sum + (c.branches?.length || 0), 0)} total branches
        </div>
      )}

      {/* Content */}
      {filteredCompanies.length === 0 && searchTerm ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{t.noCompaniesFound}</p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <CompaniesEmptyState onAddCompany={canCreateCompanies ? handleAddCompany : undefined} />
      ) : (
        <CompaniesGrid
          companies={filteredCompanies}
          onEdit={handleEditCompany}
          onDelete={handleDeleteCompany}
          onViewDetails={handleViewDetails}
          onAddBranch={handleAddBranch}
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
        onSuccess={handleModalSuccess}
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

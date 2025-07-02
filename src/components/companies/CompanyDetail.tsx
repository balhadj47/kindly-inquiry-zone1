import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompanies } from '@/hooks/useCompanies';
import { useBranchActions } from '@/hooks/useBranchActions';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronLeft, Building2, MapPin, Phone, Mail, Calendar, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Branch } from '@/hooks/useCompanies';
import BranchCard from './BranchCard';
import BranchModal from './BranchModal';
import BranchDeleteDialog from './BranchDeleteDialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const CompanyDetail = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { data: companies, refetch } = useCompanies();
  const { deleteBranch, isLoading: isDeleting } = useBranchActions();
  const permissions = useSecurePermissions();
  const company = companies?.find((c) => c.id === companyId);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  React.useEffect(() => {
    console.log('🏢 CompanyDetail: Component mounted with companyId:', companyId);
    console.log('🏢 CompanyDetail: All companies:', companies);
    console.log('🏢 CompanyDetail: Found company:', company);
    console.log('🔒 CompanyDetail: User permissions:', {
      canCreateCompanies: permissions.canCreateCompanies,
      canUpdateCompanies: permissions.canUpdateCompanies,
      canDeleteCompanies: permissions.canDeleteCompanies,
      isAdmin: permissions.isAdmin,
      isViewOnly: permissions.isViewOnly,
      currentUser: permissions.currentUser
    });
    if (company) {
      console.log('🏢 CompanyDetail: Company branches:', company.branches);
      console.log('🏢 CompanyDetail: Branches count:', company.branches?.length || 0);
    }
  }, [companyId, companies, company, permissions]);

  const handleBranchClick = (branch: Branch) => {
    navigate(`/companies/branch/${branch.id}`);
  };

  const handleAddBranch = () => {
    console.log('🔒 Attempting to add branch - canCreateCompanies:', permissions.canCreateCompanies);
    if (!permissions.canCreateCompanies || permissions.isViewOnly) {
      console.log('❌ Permission denied: Cannot create branches');
      return;
    }
    setSelectedBranch(null);
    setIsBranchModalOpen(true);
  };

  const handleEditBranch = (branch: Branch) => {
    console.log('🔒 Attempting to edit branch - canUpdateCompanies:', permissions.canUpdateCompanies);
    if (!permissions.canUpdateCompanies || permissions.isViewOnly) {
      console.log('❌ Permission denied: Cannot edit branches');
      return;
    }
    setSelectedBranch(branch);
    setIsBranchModalOpen(true);
  };

  const handleDeleteBranch = (branch: Branch) => {
    console.log('🔒 Attempting to delete branch - canDeleteCompanies:', permissions.canDeleteCompanies);
    if (!permissions.canDeleteCompanies || permissions.isViewOnly) {
      console.log('❌ Permission denied: Cannot delete branches');
      return;
    }
    setSelectedBranch(branch);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBranch) return;

    try {
      await deleteBranch(selectedBranch.id);
      refetch();
      setIsDeleteDialogOpen(false);
      setSelectedBranch(null);
    } catch (error) {
      console.error('Error deleting branch:', error);
    }
  };

  const handleBranchModalSuccess = () => {
    refetch();
  };

  if (!company) {
    return (
      <div className="space-y-4 py-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/companies')} className="cursor-pointer">
                {t.companies}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t.companyNotFoundFull}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <Card>
          <CardHeader>
            <CardTitle>{t.companyNotFoundFull}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{t.unableToFindCompany}</p>
            <Button onClick={() => navigate('/companies')} variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t.backToCompanies}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const branches = company.branches || [];
  console.log('🏢 CompanyDetail: Rendering with branches:', branches);

  return (
    <div className="space-y-6 py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/companies')} className="cursor-pointer">
              {t.companies}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{company.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-3xl">{company.name}</CardTitle>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <Calendar className="h-4 w-4 mr-1" />
                {t.createdOn} {new Date(company.created_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{t.companyInformation}</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-sm text-gray-700">{t.address}:</span>
                    <p className="text-sm text-gray-600 mt-1">
                      {company.address || <span className="italic text-gray-400">{t.noAddress}</span>}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-sm text-gray-700">{t.phone}:</span>
                    <p className="text-sm text-gray-600 mt-1">
                      {company.phone || <span className="italic text-gray-400">{t.noPhone}</span>}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-sm text-gray-700">{t.email}:</span>
                    <p className="text-sm text-gray-600 mt-1">
                      {company.email || <span className="italic text-gray-400">{t.noEmail}</span>}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{t.companyContext}</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium text-sm text-gray-700">{t.totalBranchesLabel}:</span>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{branches.length}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium text-sm text-gray-700">{t.companyStatus}:</span>
                  <p className="text-sm text-green-600 font-medium mt-1">{t.userStatus.active}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t.branches}</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {branches.length} {branches.length === 1 ? t.branch : t.branches.toLowerCase()}
            </span>
            {permissions.canCreateCompanies && !permissions.isViewOnly ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleAddBranch} 
                      size="icon"
                      className="w-12 h-12 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t.addNewBranch}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded">
                {permissions.isViewOnly ? 'View-only mode' : t.noPermissionToAdd}
              </div>
            )}
          </div>
        </div>

        {branches.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noBranchesAvailable}</h3>
              <p className="text-gray-500 text-center mb-4">
                Cette entreprise n'a pas encore de succursales enregistrées.
              </p>
              {permissions.canCreateCompanies && !permissions.isViewOnly && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        onClick={handleAddBranch} 
                        size="icon"
                        className="w-12 h-12 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t.addFirstBranch}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {branches.map((branch) => {
              console.log('🏢 CompanyDetail: Rendering branch:', branch);
              return (
                <BranchCard
                  key={branch.id}
                  branch={branch}
                  onClick={handleBranchClick}
                  onEdit={permissions.canUpdateCompanies && !permissions.isViewOnly ? handleEditBranch : undefined}
                  onDelete={permissions.canDeleteCompanies && !permissions.isViewOnly ? handleDeleteBranch : undefined}
                />
              );
            })}
          </div>
        )}
      </div>

      {(permissions.canCreateCompanies || permissions.canUpdateCompanies) && !permissions.isViewOnly && (
        <BranchModal
          isOpen={isBranchModalOpen}
          onClose={() => setIsBranchModalOpen(false)}
          branch={selectedBranch}
          companyId={company.id}
          companyName={company.name}
          onSuccess={handleBranchModalSuccess}
        />
      )}

      {permissions.canDeleteCompanies && !permissions.isViewOnly && (
        <BranchDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          branch={selectedBranch}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default CompanyDetail;

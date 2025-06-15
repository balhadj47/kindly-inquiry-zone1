
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompanies } from '@/hooks/useCompanies';
import { useBranchActions } from '@/hooks/useBranchActions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Building2, MapPin, Phone, Mail, Calendar, Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Branch } from '@/hooks/useCompanies';
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

const BranchDetail = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const { companies, refetch } = useCompanies();
  const { deleteBranch, isLoading: isDeleting } = useBranchActions();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Find the branch and its company
  let branch = null;
  let company = null;
  
  for (const comp of companies) {
    const foundBranch = comp.branches.find((b) => b.id === branchId);
    if (foundBranch) {
      branch = foundBranch;
      company = comp;
      break;
    }
  }

  const handleEditBranch = () => {
    setIsBranchModalOpen(true);
  };

  const handleDeleteBranch = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!branch) return;

    try {
      await deleteBranch(branch.id);
      navigate(`/companies/${company?.id}`);
    } catch (error) {
      console.error('Error deleting branch:', error);
    }
  };

  const handleBranchModalSuccess = () => {
    refetch();
  };

  if (!branch || !company) {
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
              <BreadcrumbPage>{t.branchNotFoundFull}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <Card>
          <CardHeader>
            <CardTitle>{t.branchNotFoundFull}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{t.unableToFindBranch}</p>
            <Button onClick={() => navigate('/companies')} variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t.backToCompanies}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-8 max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate('/companies')} className="cursor-pointer">
              {t.companies}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate(`/companies/${company.id}`)} className="cursor-pointer">
              {company.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{branch.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Branch Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-3xl">{branch.name}</CardTitle>
                <p className="text-lg text-gray-600 mt-2">{t.branchOf} {company.name}</p>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  {t.createdOn} {new Date(branch.created_at).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleEditBranch}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                {t.editBranch}
              </Button>
              <Button
                onClick={handleDeleteBranch}
                variant="outline"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                {t.deleteBranch}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Branch Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{t.branchDetails}</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-sm text-gray-700">{t.address}:</span>
                    <p className="text-gray-600 mt-1">
                      {branch.address || <span className="italic text-gray-400">{t.noAddressProvided}</span>}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-sm text-gray-700">{t.phone}:</span>
                    <p className="text-gray-600 mt-1">
                      {branch.phone || <span className="italic text-gray-400">{t.noPhoneProvided}</span>}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-sm text-gray-700">{t.email}:</span>
                    <p className="text-gray-600 mt-1">
                      {branch.email || <span className="italic text-gray-400">{t.noEmailProvided}</span>}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Context */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{t.companyContext}</h3>
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <span className="font-medium text-sm text-blue-700">{t.company}:</span>
                  <p className="text-blue-900 font-medium mt-1">{company.name}</p>
                  {company.address && (
                    <p className="text-sm text-blue-600 mt-1">{company.address}</p>
                  )}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="font-medium text-sm text-gray-700">{t.branchId}:</span>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{branch.id}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="font-medium text-sm text-gray-700">{t.branchAge}:</span>
                  <p className="text-sm text-gray-600 mt-1">
                    {Math.floor((Date.now() - new Date(branch.created_at).getTime()) / (1000 * 60 * 60 * 24))} {t.daysOld}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <BranchModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        branch={branch}
        companyId={company.id}
        companyName={company.name}
        onSuccess={handleBranchModalSuccess}
      />

      <BranchDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        branch={branch}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default BranchDetail;

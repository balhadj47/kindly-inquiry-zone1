
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompanies } from '@/hooks/useCompanies';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Building2, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import BranchCard from './BranchCard';
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
  const { companies } = useCompanies();
  const company = companies.find((c) => c.id === companyId);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleBranchClick = (branch: any) => {
    navigate(`/companies/branch/${branch.id}`);
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

  return (
    <div className="space-y-6 py-8">
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
            <BreadcrumbPage>{company.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Company Information Card */}
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
            {/* Contact Information */}
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

            {/* Company Stats */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{t.companyContext}</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium text-sm text-gray-700">{t.totalBranchesLabel}:</span>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{company.branches.length}</p>
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

      {/* Branches Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t.branches}</h2>
          <span className="text-sm text-gray-500">
            {company.branches.length} {company.branches.length === 1 ? t.branch : t.branches.toLowerCase()}
          </span>
        </div>

        {company.branches.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noBranchesAvailable}</h3>
              <p className="text-gray-500 text-center">
                Cette entreprise n'a pas encore de succursales enregistrées.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {company.branches.map((branch) => (
              <BranchCard
                key={branch.id}
                branch={branch}
                onClick={handleBranchClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;

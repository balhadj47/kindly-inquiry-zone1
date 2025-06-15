
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompanies } from '@/hooks/useCompanies';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const CompanyDetail = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { companies } = useCompanies();
  const company = companies.find((c) => c.id === companyId);
  const navigate = useNavigate();
  const { t } = useLanguage();

  if (!company) {
    return (
      <div className="space-y-2 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t.back}
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>{t.companyNotFoundFull}</CardTitle>
          </CardHeader>
          <CardContent>
            {t.unableToFindCompany}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2 py-8 max-w-2xl mx-auto">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        {t.backToCompanies}
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{company.name}</CardTitle>
          <div className="text-gray-600 text-sm mt-1">
            {t.createdOn} {new Date(company.created_at).toLocaleDateString('fr-FR')}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <span className="font-semibold">{t.address}:</span>{' '}
              <span>{company.address || <span className="italic text-gray-400">{t.noAddress}</span>}</span>
            </div>
            <div>
              <span className="font-semibold">{t.phone}:</span>{' '}
              <span>{company.phone || <span className="italic text-gray-400">{t.noPhone}</span>}</span>
            </div>
            <div>
              <span className="font-semibold">{t.email}:</span>{' '}
              <span>{company.email || <span className="italic text-gray-400">{t.noEmail}</span>}</span>
            </div>
            <div>
              <span className="font-semibold">{t.branches}:</span>
              <ul className="list-disc list-inside mt-1">
                {company.branches.length === 0 && (
                  <li className="italic text-gray-500">{t.noBranches}</li>
                )}
                {company.branches.map((b) => (
                  <li key={b.id}>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-blue-600 underline underline-offset-2 text-base"
                      onClick={() => navigate(`/companies/branch/${b.id}`)}
                    >
                      {b.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyDetail;

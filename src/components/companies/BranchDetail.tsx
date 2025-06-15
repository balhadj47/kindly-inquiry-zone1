
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompanies } from '@/hooks/useCompanies';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const BranchDetail = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const { companies } = useCompanies();
  // Find the company and branch for this branch ID
  const flatBranches = companies.flatMap((c) =>
    c.branches.map((b) => ({ ...b, company: c }))
  );
  const branchData = flatBranches.find((b) => b.id === branchId);
  const navigate = useNavigate();
  const { t } = useLanguage();

  if (!branchData) {
    return (
      <div className="space-y-2 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t.back}
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>{t.branchNotFoundFull}</CardTitle>
          </CardHeader>
          <CardContent>
            {t.unableToFindBranch}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2 py-8 max-w-xl mx-auto">
      <Button variant="ghost" size="sm" onClick={() => navigate(`/companies/${branchData.company.id}`)}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        {t.backTo} {branchData.company.name}
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{branchData.name}</CardTitle>
          <div className="text-gray-600 text-sm mt-1">
            {t.createdOn} {new Date(branchData.created_at).toLocaleDateString('fr-FR')}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">{t.company}:</span>&nbsp;
              <Button 
                variant="link" 
                className="p-0 h-auto text-blue-600 underline underline-offset-2 text-base"
                onClick={() => navigate(`/companies/${branchData.company.id}`)}
              >
                {branchData.company.name}
              </Button>
            </div>
            <div>
              <span className="font-semibold">{t.branchId}:</span> {branchData.id}
            </div>
            <div>
              <span className="font-semibold">{t.createdOn}:</span> {new Date(branchData.created_at).toLocaleDateString('fr-FR')}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchDetail;

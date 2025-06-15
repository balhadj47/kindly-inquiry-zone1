
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompanies } from '@/hooks/useCompanies';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const CompanyDetail = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const { companies } = useCompanies();
  const company = companies.find((c) => c.id === companyId);
  const navigate = useNavigate();

  if (!company) {
    return (
      <div className="space-y-2 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Company Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            Unable to find company with this ID.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2 py-8 max-w-2xl mx-auto">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Companies
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{company.name}</CardTitle>
          <div className="text-gray-600 text-sm mt-1">
            Created on {new Date(company.created_at).toLocaleDateString()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <span className="font-semibold">Address:</span>{' '}
              <span>{company.address || <span className="italic text-gray-400">No address</span>}</span>
            </div>
            <div>
              <span className="font-semibold">Phone:</span>{' '}
              <span>{company.phone || <span className="italic text-gray-400">No phone</span>}</span>
            </div>
            <div>
              <span className="font-semibold">Email:</span>{' '}
              <span>{company.email || <span className="italic text-gray-400">No email</span>}</span>
            </div>
            <div>
              <span className="font-semibold">Branches:</span>
              <ul className="list-disc list-inside mt-1">
                {company.branches.length === 0 && (
                  <li className="italic text-gray-500">No branches</li>
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

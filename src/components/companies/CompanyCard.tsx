
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Edit, Trash2, MapPin, Calendar, Phone, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Company } from '@/hooks/useCompanies';

interface CompanyCardProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (company: Company) => void;
}

const CompanyCard = ({ company, onEdit, onDelete }: CompanyCardProps) => {
  const { t } = useLanguage();

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] focus:outline focus:ring-2 focus:ring-ring">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{company.name}</CardTitle>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                Created on {new Date(company.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
          <Badge className="bg-blue-100 text-blue-800">
            {company.branches.length} {t.branches.toLowerCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Company Contact Information */}
        <div className="space-y-2">
          {company.address && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{company.address}</span>
            </div>
          )}
          
          {company.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{company.phone}</span>
            </div>
          )}
          
          {company.email && (
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{company.email}</span>
            </div>
          )}
        </div>

        {/* Branches Information */}
        {company.branches.length > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                {t.branches}: {company.branches.slice(0, 2).map(b => b.name).join(', ')}
                {company.branches.length > 2 && ` ${t.and} ${company.branches.length - 2} ${t.more}`}
              </span>
            </div>
          </div>
        )}

        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onEdit(company); }}
            className="flex-1"
          >
            <Edit className="h-3 w-3 mr-1" />
            {t.edit}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onDelete(company); }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;

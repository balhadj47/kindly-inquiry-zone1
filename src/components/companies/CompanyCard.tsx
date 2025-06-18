
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="w-full hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white cursor-pointer">
      <CardContent className="p-6">
        {/* Header with improved spacing */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-sm">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{company.name}</h3>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1 flex-shrink-0 text-gray-400" />
                <span className="truncate font-medium">{t.createdOn} {new Date(company.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>
          
          <Badge className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1">
            {company.branches.length} {t.branches.toLowerCase()}
          </Badge>
        </div>

        {/* Company Contact Information */}
        <div className="space-y-3 mb-4">
          {company.address && (
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Adresse</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{company.address}</p>
              </div>
            </div>
          )}
          
          {company.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-green-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Téléphone</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{company.phone}</p>
              </div>
            </div>
          )}
          
          {company.email && (
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Email</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{company.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Branches Information */}
        {company.branches.length > 0 && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex items-start space-x-2">
              <Building2 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-blue-600 font-medium mb-1">{t.branches}</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {company.branches.slice(0, 2).map(b => b.name).join(', ')}
                  {company.branches.length > 2 && ` ${t.and} ${company.branches.length - 2} ${t.more}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onEdit(company); }}
            className="flex-1 h-9 font-medium hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            {t.edit}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onDelete(company); }}
            className="h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;

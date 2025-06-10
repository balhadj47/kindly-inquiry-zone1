
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Edit, Trash2, MapPin, Calendar, Plus } from 'lucide-react';
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
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] border-0 bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 backdrop-blur-sm">
      {/* Decorative gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
      <div className="absolute inset-[1px] bg-white rounded-lg" />
      
      {/* Content container */}
      <div className="relative z-10">
        <CardHeader className="pb-4 px-6 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start space-x-4 min-w-0 flex-1">
              {/* Company icon with enhanced styling */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-300 shadow-sm">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm" />
              </div>
              
              {/* Company info */}
              <div className="min-w-0 flex-1">
                <CardTitle className="text-xl font-bold text-gray-900 break-words mb-2 group-hover:text-blue-700 transition-colors">
                  {company.name}
                </CardTitle>
                <div className="flex items-center text-sm text-gray-500 bg-gray-50 rounded-full px-3 py-1 w-fit">
                  <Calendar className="h-3 w-3 mr-2" />
                  Créée le {new Date(company.created_at).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(company);
                }}
                className="touch-manipulation bg-white/80 backdrop-blur-sm border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm"
              >
                <Edit className="h-3 w-3 mr-2" />
                Modifier
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(company);
                }}
                className="touch-manipulation bg-white/80 backdrop-blur-sm border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 shadow-sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-6 pb-6 space-y-5">
          {/* Branches section with enhanced design */}
          <div className="relative">
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-5 border border-gray-100/60 shadow-sm backdrop-blur-sm">
              {/* Section header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-2 rounded-lg">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    Succursales
                  </h4>
                </div>
                <Badge 
                  className={`
                    text-sm font-bold px-3 py-1 rounded-full shadow-sm
                    ${company.branches.length > 0 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-600'
                    }
                  `}
                >
                  {company.branches.length}
                </Badge>
              </div>
              
              {/* Branches content */}
              {company.branches.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {company.branches.slice(0, 2).map((branch, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-sm bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 hover:from-blue-200 hover:to-indigo-200 transition-all duration-200 shadow-sm font-medium px-3 py-1"
                      >
                        {branch.name}
                      </Badge>
                    ))}
                    {company.branches.length > 2 && (
                      <Badge 
                        variant="outline" 
                        className="text-sm text-indigo-600 border-indigo-300 bg-white hover:bg-indigo-50 transition-all duration-200 shadow-sm font-medium px-3 py-1"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {company.branches.length - 2} autres
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-gray-400 mb-2">
                    <MapPin className="h-8 w-8 mx-auto opacity-50" />
                  </div>
                  <p className="text-sm text-gray-500 italic">Aucune succursale configurée</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer with improved styling */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
              <span className="text-sm font-semibold text-blue-600">
                {company.branches.length}
              </span>
              <span className="text-sm text-gray-600">
                {company.branches.length === 1 ? 'succursale' : 'succursales'}
              </span>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
              <span className="text-xs text-gray-500 font-mono">
                ID: {company.id.slice(0, 8)}...
              </span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default CompanyCard;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Branch } from '@/hooks/useCompanies';

interface BranchCardProps {
  branch: Branch;
  onClick: (branch: Branch) => void;
}

const BranchCard = ({ branch, onClick }: BranchCardProps) => {
  const { t } = useLanguage();

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer focus:outline focus:ring-2 focus:ring-ring"
      onClick={() => onClick(branch)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Building2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{branch.name}</CardTitle>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                {t.createdOn} {new Date(branch.created_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800">
            {t.activeBranch}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Branch Contact Information */}
        <div className="space-y-2">
          {branch.address ? (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{branch.address}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-400 italic">{t.noAddress}</span>
            </div>
          )}
          
          {branch.phone ? (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{branch.phone}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-400 italic">{t.noPhone}</span>
            </div>
          )}
          
          {branch.email ? (
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{branch.email}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-400 italic">{t.noEmail}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchCard;


import React from 'react';
import { Building2, MapPin } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface MissionCompaniesProps {
  mission: Trip;
}

const MissionCompanies: React.FC<MissionCompaniesProps> = ({ mission }) => {
  // Handle multiple companies with beautiful cards
  if (mission.companies_data && Array.isArray(mission.companies_data) && mission.companies_data.length > 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          Entreprises ({mission.companies_data.length})
        </h3>
        <div className="grid gap-3">
          {mission.companies_data.map((company, index) => (
            <Card key={index} className="group transition-all duration-200 hover:shadow-md hover:scale-[1.01] border-gray-200 hover:border-blue-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-100 text-blue-800 border-blue-200 font-medium"
                      >
                        {company.companyName}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{company.branchName}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Single company with beautiful card design
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Building2 className="h-5 w-5 text-blue-600" />
        Entreprise
      </h3>
      <Card className="group transition-all duration-200 hover:shadow-md hover:scale-[1.01] border-gray-200 hover:border-blue-300">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge 
                  variant="secondary" 
                  className="bg-blue-100 text-blue-800 border-blue-200 font-medium"
                >
                  {mission.company}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{mission.branch}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MissionCompanies;

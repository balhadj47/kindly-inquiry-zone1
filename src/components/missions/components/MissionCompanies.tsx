
import React from 'react';
import { Building2 } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import { Badge } from '@/components/ui/badge';

interface MissionCompaniesProps {
  mission: Trip;
}

const MissionCompanies: React.FC<MissionCompaniesProps> = ({ mission }) => {
  // Handle multiple companies
  if (mission.companies_data && Array.isArray(mission.companies_data) && mission.companies_data.length > 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Entreprises</h3>
        <div className="space-y-3">
          {mission.companies_data.map((company, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{company.companyName}</Badge>
                  <span className="text-sm text-gray-500">→</span>
                  <Badge variant="outline">{company.branchName}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Single company fallback
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Entreprise</h3>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <Building2 className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Entreprise</p>
          <p className="text-base font-medium text-gray-900">{mission.company}</p>
          <p className="text-sm text-gray-600">{mission.branch}</p>
        </div>
      </div>
    </div>
  );
};

export default MissionCompanies;

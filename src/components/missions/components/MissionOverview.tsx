
import React from 'react';
import { User, Truck, Calendar } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import { formatDate } from '@/utils/dateUtils';

interface MissionOverviewProps {
  mission: Trip;
  driverName: string;
  vanInfo: {
    model: string;
    licensePlate: string;
  };
}

const MissionOverview: React.FC<MissionOverviewProps> = ({
  mission,
  driverName,
  vanInfo,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Générales</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Chauffeur</p>
            <p className="text-base font-medium text-gray-900">{driverName}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
            <Truck className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Véhicule</p>
            <p className="text-base font-medium text-gray-900">{vanInfo.model}</p>
            <p className="text-sm text-gray-600">{vanInfo.licensePlate}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
            <Calendar className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Date de Création</p>
            <p className="text-base font-medium text-gray-900">
              {formatDate(mission.timestamp || mission.created_at || new Date().toISOString())}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionOverview;

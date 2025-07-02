
import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import { formatDate } from '@/utils/dateUtils';

interface MissionTimelineProps {
  mission: Trip;
}

const MissionTimeline: React.FC<MissionTimelineProps> = ({ mission }) => {
  const hasPlannedDates = mission.planned_start_date || mission.startDate;
  const hasKilometers = mission.start_km || mission.startKm;

  if (!hasPlannedDates && !hasKilometers) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Planification & Kilométrage</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Planned Dates */}
        {hasPlannedDates && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-gray-700">Dates Planifiées</h4>
            </div>
            <div className="space-y-2 pl-8">
              <div>
                <p className="text-sm text-gray-500">Début planifié</p>
                <p className="text-base text-gray-900">
                  {formatDate(mission.planned_start_date || mission.startDate!)}
                </p>
              </div>
              {(mission.planned_end_date || mission.endDate) && (
                <div>
                  <p className="text-sm text-gray-500">Fin planifiée</p>
                  <p className="text-base text-gray-900">
                    {formatDate(mission.planned_end_date || mission.endDate!)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Kilometers */}
        {hasKilometers && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-orange-600" />
              <h4 className="font-medium text-gray-700">Kilométrage</h4>
            </div>
            <div className="space-y-2 pl-8">
              <div>
                <p className="text-sm text-gray-500">Km initial</p>
                <p className="text-base text-gray-900">{mission.start_km || mission.startKm} km</p>
              </div>
              {(mission.end_km || mission.endKm) && (
                <div>
                  <p className="text-sm text-gray-500">Km final</p>
                  <p className="text-base text-gray-900 font-semibold text-blue-600">
                    {mission.end_km || mission.endKm} km
                  </p>
                </div>
              )}
              {(mission.start_km || mission.startKm) && (mission.end_km || mission.endKm) && (
                <div>
                  <p className="text-sm text-gray-500">Distance parcourue</p>
                  <p className="text-base font-medium text-green-600">
                    {((mission.end_km || mission.endKm!) - (mission.start_km || mission.startKm!))} km
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionTimeline;

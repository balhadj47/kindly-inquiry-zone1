
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Building2, Truck } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';

interface MissionsHeaderProps {
  trips: Trip[];
  onNewMissionClick: () => void;
  canCreateMissions: boolean;
}

const MissionsHeader: React.FC<MissionsHeaderProps> = ({ 
  trips, 
  onNewMissionClick, 
  canCreateMissions 
}) => {
  // Calculate real stats from database
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const todayMissions = trips.filter(trip => {
    const tripDate = new Date(trip.timestamp);
    return tripDate >= startOfToday;
  }).length;

  const thisWeekMissions = trips.filter(trip => {
    const tripDate = new Date(trip.timestamp);
    return tripDate >= startOfWeek;
  }).length;

  const totalVisitedCompanies = new Set(trips.map(trip => trip.company)).size;

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Missions</h1>
          <p className="text-gray-600">Gérez et suivez toutes vos missions</p>
        </div>
        
        {canCreateMissions && (
          <Button
            onClick={onNewMissionClick}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Mission
          </Button>
        )}
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Missions Aujourd'hui
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {todayMissions}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Cette Semaine
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {thisWeekMissions}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <Truck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Entreprises Visitées
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalVisitedCompanies}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <Building2 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionsHeader;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Truck } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import MissionCard from './MissionCard';

interface MissionListProps {
  trips: Trip[];
  getVanDisplayName: (vanId: string) => string;
  onNewMissionClick: () => void;
  onViewDetails: (trip: Trip) => void;
  onDelete: (trip: Trip) => void;
  onTerminate: (trip: Trip) => void;
}

const MissionList: React.FC<MissionListProps> = ({ 
  trips, 
  getVanDisplayName, 
  onNewMissionClick,
  onViewDetails,
  onDelete,
  onTerminate
}) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm">
      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-white">
        <h2 className="text-xl font-bold text-gray-900">Missions Récentes</h2>
        <p className="text-gray-600 mt-1">Liste de toutes les missions ({trips.length} total)</p>
      </div>
      
      {trips.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-blue-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Truck className="h-10 w-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune Mission</h3>
          <p className="text-gray-600 mb-6">
            Aucune mission n'a été enregistrée pour le moment.
          </p>
          <Button
            onClick={onNewMissionClick}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer une Mission
          </Button>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid gap-6">
            {trips.slice(0, 10).map((trip) => (
              <MissionCard 
                key={trip.id}
                trip={trip}
                getVanDisplayName={getVanDisplayName}
                onViewDetails={onViewDetails}
                onDelete={onDelete}
                onTerminate={onTerminate}
              />
            ))}
          </div>
          
          {trips.length > 10 && (
            <div className="mt-6 text-center">
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                Voir plus de missions
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MissionList;

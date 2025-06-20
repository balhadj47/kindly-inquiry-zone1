
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Truck } from 'lucide-react';
import { Trip } from '@/contexts/TripContext';
import MissionCard from './MissionCard';

interface MissionListProps {
  trips: Trip[];
  getVanDisplayName: (vanId: string) => string;
  onNewMissionClick: () => void;
}

const MissionList: React.FC<MissionListProps> = ({ 
  trips, 
  getVanDisplayName, 
  onNewMissionClick 
}) => {
  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Missions Récentes</h2>
        <p className="text-gray-600 mt-1">Liste de toutes les missions ({trips.length} total)</p>
      </div>
      
      {trips.length === 0 ? (
        <div className="text-center py-12">
          <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
          <div className="space-y-4">
            {trips.slice(0, 10).map((trip) => (
              <MissionCard 
                key={trip.id}
                trip={trip}
                getVanDisplayName={getVanDisplayName}
              />
            ))}
          </div>
          
          {trips.length > 10 && (
            <div className="mt-6 text-center">
              <Button variant="outline">
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

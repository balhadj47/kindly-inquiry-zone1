
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TripHistoryContainer from '@/components/trip-history/TripHistoryContainer';
import TripHistoryLayout from '@/components/trip-history/TripHistoryLayout';
import NewTripDialog from '@/components/NewTripDialog';

const TripsPage = () => {
  const [isNewTripDialogOpen, setIsNewTripDialogOpen] = useState(false);

  return (
    <TripHistoryLayout>
      {/* Header with New Trip Button */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Gestion des Voyages</h1>
            <p className="text-blue-100 text-lg">
              Créez de nouveaux voyages et consultez l'historique
            </p>
          </div>
          <Button
            onClick={() => setIsNewTripDialogOpen(true)}
            className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-6 py-3 h-auto shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouveau Voyage
          </Button>
        </div>
      </div>

      {/* Trip History Content */}
      <TripHistoryContainer />

      {/* New Trip Dialog */}
      <NewTripDialog
        isOpen={isNewTripDialogOpen}
        onClose={() => setIsNewTripDialogOpen(false)}
      />
    </TripHistoryLayout>
  );
};

export default TripsPage;

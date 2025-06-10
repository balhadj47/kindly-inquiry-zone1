
import React from 'react';
import { Truck } from 'lucide-react';

interface TripHistoryEmptyStateProps {
  filteredTripsCount: number;
  totalTripsCount: number;
}

const TripHistoryEmptyState: React.FC<TripHistoryEmptyStateProps> = ({
  filteredTripsCount,
  totalTripsCount
}) => {
  return (
    <div className="text-center py-12">
      <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun voyage trouvé</h3>
      <p className="text-gray-600">
        {totalTripsCount === 0 
          ? "Aucun voyage n'a encore été enregistré."
          : "Aucun voyage ne correspond aux filtres sélectionnés."
        }
      </p>
    </div>
  );
};

export default TripHistoryEmptyState;

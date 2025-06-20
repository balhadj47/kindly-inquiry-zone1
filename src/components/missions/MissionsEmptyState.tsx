
import React from 'react';
import { Truck, Filter } from 'lucide-react';

interface MissionsEmptyStateProps {
  filteredTripsCount: number;
  totalTripsCount: number;
}

const MissionsEmptyState: React.FC<MissionsEmptyStateProps> = ({
  filteredTripsCount,
  totalTripsCount
}) => {
  const hasFilters = filteredTripsCount === 0 && totalTripsCount > 0;

  return (
    <div className="text-center py-12">
      <div className="bg-gray-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
        {hasFilters ? (
          <Filter className="h-10 w-10 text-gray-400" />
        ) : (
          <Truck className="h-10 w-10 text-gray-400" />
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {hasFilters ? 'Aucun résultat' : 'Aucune Mission'}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {hasFilters 
          ? 'Aucune mission ne correspond à vos critères de recherche. Essayez de modifier vos filtres.'
          : 'Aucune mission n\'a été enregistrée pour le moment. Créez votre première mission pour commencer.'
        }
      </p>
    </div>
  );
};

export default MissionsEmptyState;

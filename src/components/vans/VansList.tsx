
import React from 'react';
import { Car } from 'lucide-react';
import { Van } from '@/types/van';
import VanCard from './VanCard';

interface VansListProps {
  vans: Van[];
  searchTerm: string;
  statusFilter: string;
  onEditVan: (van: Van) => void;
  onDeleteVan: (van: Van) => void;
  onViewVan: (van: Van) => void;
}

const VansList: React.FC<VansListProps> = ({
  vans,
  searchTerm,
  statusFilter,
  onEditVan,
  onDeleteVan,
  onViewVan,
}) => {
  if (vans.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Car className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Aucun véhicule trouvé
        </h3>
        <p className="text-gray-500">
          {searchTerm || statusFilter !== 'all' 
            ? 'Aucun véhicule ne correspond aux filtres actuels.'
            : 'Aucun véhicule n\'a été ajouté pour le moment.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vans.map(van => (
        <VanCard
          key={van.id}
          van={van}
          onEdit={onEditVan}
          onDelete={onDeleteVan}
          onClick={onViewVan}
        />
      ))}
    </div>
  );
};

export default VansList;

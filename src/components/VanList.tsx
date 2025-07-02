
import React from 'react';
import { Van } from '@/types/van';
import VanCard from './VanCard';

interface VanListProps {
  vans: Van[];
  onEditVan: (van: Van) => void;
  onDeleteVan: (van: Van) => void;
  onViewDetails: (van: Van) => void;
}

const VanList: React.FC<VanListProps> = ({
  vans,
  onEditVan,
  onDeleteVan,
  onViewDetails,
}) => {
  if (vans.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune camionnette trouvée</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vans.map((van) => (
        <VanCard
          key={van.id}
          van={van}
          onEdit={() => onEditVan(van)}
          onDelete={() => onDeleteVan(van)}
          onViewDetails={() => onViewDetails(van)}
        />
      ))}
    </div>
  );
};

export default VanList;

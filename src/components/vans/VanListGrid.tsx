
import React from 'react';
import VanCard from '../VanCard';
import { Van } from '@/types/van';

interface VanListGridProps {
  vans: Van[];
  onEditVan: (van: Van) => void;
  onQuickAction: (van: Van) => void;
  onDeleteVan: (van: Van) => void;
}

const VanListGrid = ({ vans, onEditVan, onQuickAction, onDeleteVan }: VanListGridProps) => {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {vans.map((van) => (
        <VanCard
          key={van.id}
          van={van}
          onEdit={onEditVan}
          onQuickAction={onQuickAction}
          onDelete={onDeleteVan}
        />
      ))}
    </div>
  );
};

export default VanListGrid;

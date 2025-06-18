
import React from 'react';
import VanCard from '../VanCard';
import { Van } from '@/types/van';

interface VirtualizedVanCardProps {
  index: number;
  style: React.CSSProperties;
  data: {
    vans: Van[];
    onEditVan: (van: Van) => void;
    onDeleteVan: (van: Van) => void;
    onNavigate: (van: Van) => void;
  };
}

const VirtualizedVanCard: React.FC<VirtualizedVanCardProps> = ({ index, style, data }) => {
  const { vans, onEditVan, onDeleteVan, onNavigate } = data;
  const van = vans[index];

  if (!van) return null;

  return (
    <div 
      style={style} 
      className="px-1 py-2 cursor-pointer"
      onClick={(e) => {
        // Prevent navigation when clicking action buttons
        if ((e.target as HTMLElement).closest('button')) return;
        onNavigate(van);
      }}
    >
      <VanCard
        van={van}
        onEdit={onEditVan}
        onQuickAction={onNavigate}
        onDelete={onDeleteVan}
      />
    </div>
  );
};

export default VirtualizedVanCard;

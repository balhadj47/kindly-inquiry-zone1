
import React from 'react';
import VanCard from '../VanCard';

interface VirtualizedVanCardProps {
  index: number;
  style: React.CSSProperties;
  data: {
    vans: any[];
    onEdit: (van: any) => void;
    onQuickAction: (action: string, van: any) => void;
    onDelete: (van: any) => void;
  };
}

const VirtualizedVanCard: React.FC<VirtualizedVanCardProps> = ({ index, style, data }) => {
  const { vans, onEdit, onQuickAction, onDelete } = data;
  const van = vans[index];

  if (!van) return null;

  return (
    <div style={style} className="px-1 py-2">
      <VanCard
        van={van}
        onEdit={onEdit}
        onQuickAction={onQuickAction}
        onDelete={onDelete}
      />
    </div>
  );
};

export default VirtualizedVanCard;

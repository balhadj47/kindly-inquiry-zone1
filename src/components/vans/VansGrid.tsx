
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import VanCard from '../VanCard';
import VirtualizedList from '@/components/ui/virtualized-list';
import VirtualizedVanCard from '@/components/virtualized/VirtualizedVanCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface VansGridProps {
  vans: any[];
  onEditVan: (van: any) => void;
  onDeleteVan: (van: any) => void;
}

const VansGrid = ({ vans, onEditVan, onDeleteVan }: VansGridProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const useVirtualization = vans.length > 20 && !isMobile;

  const handleVanClick = (van: any) => {
    navigate(`/vans/${van.id}`);
  };

  const virtualizedData = {
    vans,
    onEditVan,
    onDeleteVan
  };

  if (useVirtualization) {
    return (
      <Card>
        <CardContent className="p-6">
          <VirtualizedList
            height={600}
            itemCount={vans.length}
            itemSize={280}
            itemData={virtualizedData}
          >
            {VirtualizedVanCard}
          </VirtualizedList>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`grid gap-4 sm:gap-6 ${
      isMobile 
        ? 'grid-cols-1' 
        : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
    }`}>
      {vans.map((van) => (
        <div
          key={van.id}
          className="cursor-pointer"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('button')) return;
            handleVanClick(van);
          }}
        >
          <VanCard
            van={van}
            onEdit={onEditVan}
            onQuickAction={() => {}}
            onDelete={onDeleteVan}
          />
        </div>
      ))}
    </div>
  );
};

export default VansGrid;

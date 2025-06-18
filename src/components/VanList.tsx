
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, Plus } from 'lucide-react';
import VanCard from './VanCard';
import VirtualizedList from '@/components/ui/virtualized-list';
import VirtualizedVanCard from '@/components/virtualized/VirtualizedVanCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface VanListProps {
  vans: any[];
  totalVans: number;
  searchTerm: string;
  statusFilter: string;
  onAddVan: () => void;
  onEditVan: (van: any) => void;
  onQuickAction: (action: string, van: any) => void;
  onDeleteVan: (van: any) => void;
}

const VanList = React.memo(({ 
  vans, 
  totalVans, 
  searchTerm, 
  statusFilter, 
  onAddVan, 
  onEditVan, 
  onQuickAction,
  onDeleteVan
}: VanListProps) => {
  const isMobile = useIsMobile();
  const showSummary = vans.length !== totalVans;
  const useVirtualization = vans.length > 20 && !isMobile;

  if (vans.length === 0) {
    return (
      <>
        {showSummary && (
          <div className="text-sm text-gray-600 mb-4">
            Affichage de {vans.length} sur {totalVans} camionnettes
          </div>
        )}
        <Card>
          <CardContent className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune camionnette trouvée</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? "Essayez d'ajuster votre recherche ou vos filtres" 
                : "Commencez par ajouter votre première camionnette"
              }
            </p>
            {(!searchTerm && statusFilter === 'all') && (
              <Button onClick={onAddVan}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Votre Première Camionnette
              </Button>
            )}
          </CardContent>
        </Card>
      </>
    );
  }

  const virtualizedData = {
    vans,
    onEdit: onEditVan,
    onQuickAction,
    onDelete: onDeleteVan
  };

  if (useVirtualization) {
    return (
      <VirtualizedList
        height={600}
        itemCount={vans.length}
        itemSize={280}
        itemData={virtualizedData}
        className="border rounded-lg"
      >
        {VirtualizedVanCard}
      </VirtualizedList>
    );
  }

  return (
    <div className="w-full">
      {showSummary && (
        <div className="text-sm text-gray-600 mb-4">
          Affichage de {vans.length} sur {totalVans} camionnettes
        </div>
      )}
      
      {/* Simple flexbox layout for better control */}
      <div className="flex flex-wrap gap-4">
        {vans.map((van) => (
          <div
            key={van.id}
            className="flex-1 min-w-[300px] max-w-[400px]"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('button')) return;
              onEditVan(van);
            }}
          >
            <VanCard
              van={van}
              onEdit={onEditVan}
              onQuickAction={onQuickAction}
              onDelete={onDeleteVan}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

VanList.displayName = 'VanList';

export default VanList;

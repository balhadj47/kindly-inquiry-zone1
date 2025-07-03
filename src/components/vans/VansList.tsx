
import React from 'react';
import { Car, Plus } from 'lucide-react';
import { Van } from '@/types/van';
import VanCard from './VanCard';
import EnhancedEmptyState from '@/components/ui/enhanced-empty-state';

interface VansListProps {
  vans: Van[];
  searchTerm: string;
  statusFilter: string;
  onEditVan: (van: Van) => void;
  onDeleteVan: (van: Van) => void;
  onViewVan: (van: Van) => void;
  onAddVan?: () => void;
}

const VansList: React.FC<VansListProps> = ({
  vans,
  searchTerm,
  statusFilter,
  onEditVan,
  onDeleteVan,
  onViewVan,
  onAddVan,
}) => {
  if (vans.length === 0) {
    const hasFilters = searchTerm || statusFilter !== 'all';
    
    return (
      <div className="py-8">
        <EnhancedEmptyState
          icon={Car}
          title={hasFilters ? "Aucun véhicule trouvé" : "Aucun véhicule disponible"}
          description={
            hasFilters 
              ? "Aucun véhicule ne correspond aux filtres actuels. Essayez d'ajuster vos critères de recherche."
              : "Commencez par ajouter votre premier véhicule pour gérer votre flotte."
          }
          actionLabel={!hasFilters ? "Ajouter un véhicule" : undefined}
          secondaryActionLabel={hasFilters ? "Effacer les filtres" : undefined}
          onAction={!hasFilters ? onAddVan : undefined}
          onSecondaryAction={hasFilters ? () => window.location.reload() : undefined}
          size="md"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

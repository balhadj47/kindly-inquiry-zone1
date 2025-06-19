
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshButton } from '@/components/ui/refresh-button';
import { Plus, Search } from 'lucide-react';

interface VansHeaderProps {
  onAddVan: () => void;
  onRefresh: () => void;
  onCheckChanges?: () => void;
}

const VansHeader: React.FC<VansHeaderProps> = ({ onAddVan, onRefresh, onCheckChanges }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Gestion des Camionnettes
        </h1>
        <p className="text-gray-600 mt-1">
          Gérez votre flotte de véhicules
        </p>
      </div>
      
      <div className="flex items-center gap-2 mt-4 lg:mt-0">
        {onCheckChanges && (
          <Button
            onClick={onCheckChanges}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Vérifier les changements
          </Button>
        )}
        
        <RefreshButton onRefresh={onRefresh} />
        
        <Button 
          onClick={onAddVan}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter une camionnette
        </Button>
      </div>
    </div>
  );
};

export default VansHeader;

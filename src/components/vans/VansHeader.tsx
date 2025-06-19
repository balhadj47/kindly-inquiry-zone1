
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface VansHeaderProps {
  onAddVan: () => void;
}

const VansHeader: React.FC<VansHeaderProps> = ({ onAddVan }) => {
  return (
    <div className="space-y-3">
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
          <Button 
            onClick={onAddVan}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter une camionnette
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VansHeader;

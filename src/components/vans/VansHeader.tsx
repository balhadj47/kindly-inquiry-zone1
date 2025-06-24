
import React from 'react';
import { PlusButton } from '@/components/ui/plus-button';

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
          <PlusButton onClick={onAddVan} />
        </div>
      </div>
    </div>
  );
};

export default VansHeader;

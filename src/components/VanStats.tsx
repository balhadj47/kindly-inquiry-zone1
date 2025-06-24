
import React from 'react';
import { PlusButton } from '@/components/ui/plus-button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface VanStatsProps {
  vans: any[];
  onAddVan: () => void;
}

const VanStats = ({ vans, onAddVan }: VanStatsProps) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Camionnettes</h1>
        <div className="flex items-center space-x-6 mt-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              {vans.length} Camionnettes
            </span>
          </div>
        </div>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PlusButton onClick={onAddVan} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Ajouter Nouvelle Camionnette</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default VanStats;

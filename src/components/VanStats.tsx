
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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
      <Button 
        onClick={onAddVan} 
        size="icon"
        className="mt-4 lg:mt-0 w-12 h-12 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        title="Ajouter Nouvelle Camionnette"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default VanStats;

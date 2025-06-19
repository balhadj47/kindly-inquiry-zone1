
import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, RefreshCw } from 'lucide-react';

interface VansHeaderProps {
  onAddVan: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  refreshProgress?: number;
}

const VansHeader: React.FC<VansHeaderProps> = ({ 
  onAddVan, 
  onRefresh,
  isRefreshing = false,
  refreshProgress = 0
}) => {
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
            onClick={onRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 px-3 transition-all duration-200"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isRefreshing ? 'Actualisation...' : 'Actualiser'}
            </span>
          </Button>
          
          <Button 
            onClick={onAddVan}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter une camionnette
          </Button>
        </div>
      </div>
      
      {/* Modern refresh progress bar */}
      {isRefreshing && (
        <div className="w-full">
          <Progress 
            value={refreshProgress} 
            className="h-2 bg-gray-200"
          />
          <p className="text-xs text-gray-500 mt-1 text-center">
            Actualisation en cours... {Math.round(refreshProgress)}%
          </p>
        </div>
      )}
    </div>
  );
};

export default VansHeader;

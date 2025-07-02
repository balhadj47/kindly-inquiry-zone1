
import React from 'react';
import { Truck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface VansHeaderProps {
  onAddVan?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  vansCount?: number;
}

const VansHeader: React.FC<VansHeaderProps> = ({ vansCount = 0 }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Truck className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Gestion des Véhicules
            </h1>
            <p className="text-gray-600 mt-1">
              {vansCount} véhicule{vansCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VansHeader;

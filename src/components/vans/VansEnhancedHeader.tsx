
import React from 'react';
import { Car, Plus, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { ActionButton } from '@/components/ui/action-button';
import { Badge } from '@/components/ui/badge';

interface VansEnhancedHeaderProps {
  vansCount: number;
  onAddVan: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

const VansEnhancedHeader: React.FC<VansEnhancedHeaderProps> = ({
  vansCount,
  onAddVan,
  onRefresh,
  isRefreshing = false
}) => {
  const actions = (
    <div className="flex items-center gap-3">
      <ActionButton
        onClick={onRefresh}
        icon={RefreshCw}
        variant="outline"
        size="default"
        disabled={isRefreshing}
        loading={isRefreshing}
        className="shadow-sm"
      >
        Actualiser
      </ActionButton>
      
      <ActionButton
        onClick={onAddVan}
        icon={Plus}
        variant="primary"
        size="default"
        className="shadow-md hover:shadow-lg"
      >
        Nouveau Véhicule
      </ActionButton>
    </div>
  );

  return (
    <PageHeader
      title="Gestion des Camionnettes"
      subtitle={
        <div className="flex items-center gap-2 mt-2">
          <span className="text-gray-600">
            Gérez votre flotte de véhicules
          </span>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
            {vansCount} véhicule{vansCount !== 1 ? 's' : ''}
          </Badge>
        </div>
      }
      icon={Car}
      iconColor="text-blue-600"
      iconBgColor="bg-blue-100"
      actions={actions}
      className="bg-gradient-to-r from-blue-50/30 to-indigo-50/30 rounded-xl p-6 border border-blue-100"
    />
  );
};

export default VansEnhancedHeader;

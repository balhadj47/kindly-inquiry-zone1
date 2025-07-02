
import React from 'react';
import { Truck } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

interface VansHeaderProps {
  onAddVan?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  vansCount?: number;
}

const VansHeader: React.FC<VansHeaderProps> = ({ vansCount = 0 }) => {
  return (
    <PageHeader
      title="Gestion des Véhicules"
      subtitle={`${vansCount} véhicule${vansCount !== 1 ? 's' : ''}`}
      icon={Truck}
      iconColor="text-blue-600"
      iconBgColor="bg-blue-100"
    />
  );
};

export default VansHeader;

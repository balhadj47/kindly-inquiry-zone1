
import React from 'react';
import { Bell } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';

interface MissionsHeaderProps {
  missionsCount: number;
}

const MissionsHeader: React.FC<MissionsHeaderProps> = ({ 
  missionsCount
}) => {
  return (
    <PageHeader
      title="Gestion des Missions"
      subtitle={`${missionsCount} mission${missionsCount !== 1 ? 's' : ''} active${missionsCount !== 1 ? 's' : ''}`}
      icon={Bell}
      iconColor="text-blue-600"
      iconBgColor="bg-blue-100"
    />
  );
};

export default MissionsHeader;

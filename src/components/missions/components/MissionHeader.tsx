
import React from 'react';
import { Circle } from 'lucide-react';
import { DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Trip } from '@/contexts/TripContext';
import { getStatusColor, getStatusText } from '../utils/missionStatusUtils';
import { useUsers } from '@/hooks/users';
import { useVans } from '@/hooks/useVansOptimized';

interface MissionHeaderProps {
  mission: Trip;
}

const MissionHeader: React.FC<MissionHeaderProps> = ({ mission }) => {
  const { data: usersData } = useUsers();
  const { data: vans = [] } = useVans();
  const users = usersData?.users || [];

  // Get Chef de Groupe name
  const getChefDeGroupeName = () => {
    if (mission?.userRoles && mission.userRoles.length > 0) {
      const chefUserRole = mission.userRoles.find(userRole => 
        userRole.roles.some(role => {
          if (typeof role === 'string') {
            return role === 'Chef de Groupe';
          } else if (typeof role === 'object' && role !== null) {
            const roleObj = role as any;
            return roleObj.name === 'Chef de Groupe';
          }
          return false;
        })
      );

      if (chefUserRole) {
        const user = users.find(u => u.id.toString() === chefUserRole.userId.toString());
        if (user) {
          return user.name;
        }
      }
    }
    return 'Aucun Chef de Groupe assigné';
  };

  // Get van reference
  const getVanReference = () => {
    const van = vans.find(v => v.id === mission.van || v.reference_code === mission.van);
    if (van && van.reference_code) {
      return van.reference_code;
    }
    return mission.van || 'Van non spécifié';
  };

  return (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <DialogTitle className="text-2xl font-semibold text-gray-900">
          {getChefDeGroupeName()}
        </DialogTitle>
        <DialogDescription className="text-base text-gray-600">
          {getVanReference()}
        </DialogDescription>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Circle className={`h-2.5 w-2.5 fill-current ${
            mission.status === 'active' ? 'text-emerald-500' : 
            mission.status === 'completed' ? 'text-blue-500' : 
            mission.status === 'terminated' ? 'text-red-500' : 'text-gray-500'
          }`} />
          <span className={`text-sm font-medium ${getStatusColor(mission.status || 'active')}`}>
            {getStatusText(mission.status || 'active')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MissionHeader;

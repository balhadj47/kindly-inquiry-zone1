
import { Trip } from '@/contexts/TripContext';
import { User } from '@/types/rbac';
import { Van } from '@/types/van';

export const getMissionTitle = (mission: Trip, vans: Van[]) => {
  const van = vans.find(v => v.id === mission.van || v.reference_code === mission.van);
  const vanReference = van?.reference_code || '';
  const baseTitle = `${mission.company} - ${mission.branch}`;
  
  return vanReference ? `${baseTitle} - ${vanReference}` : baseTitle;
};

export const getDriverName = (mission: Trip, users: User[]) => {
  if (!mission?.userRoles || mission.userRoles.length === 0) {
    return mission?.driver || 'Aucun chauffeur assigné';
  }

  const driverUserRole = mission.userRoles.find(userRole => 
    userRole.roles.some(role => {
      if (typeof role === 'string') {
        return role === 'Chauffeur';
      } else if (typeof role === 'object' && role !== null) {
        const roleObj = role as any;
        return roleObj.name === 'Chauffeur';
      }
      return false;
    })
  );

  if (driverUserRole) {
    const user = users.find(u => {
      const userIdStr = u.id.toString();
      return userIdStr === driverUserRole.userId;
    });
    return user ? user.name : `User ${driverUserRole.userId}`;
  }

  return mission?.driver || 'Aucun chauffeur assigné';
};

export const getStatusConfig = (status: string) => {
  switch (status) {
    case 'active':
      return { 
        label: 'Active', 
        variant: 'default' as const, 
        color: 'emerald' 
      };
    case 'completed':
      return { 
        label: 'Terminée', 
        variant: 'outline' as const, 
        color: 'blue' 
      };
    case 'terminated':
      return { 
        label: 'Annulée', 
        variant: 'destructive' as const, 
        color: 'red' 
      };
    default:
      return { 
        label: 'Inconnu', 
        variant: 'secondary' as const, 
        color: 'gray' 
      };
  }
};

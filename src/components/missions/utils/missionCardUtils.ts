
import { Trip } from '@/contexts/TripContext';
import { User as HooksUser } from '@/hooks/users/types';
import { Van } from '@/types/van';

export const getDriverName = (mission: Trip, users: HooksUser[]): string => {
  if (!mission.driver) return 'Aucun chauffeur';
  
  const driver = users.find(user => user.id.toString() === mission.driver.toString());
  return driver?.name || mission.driver || 'Chauffeur inconnu';
};

export const getChefDeGroupeName = (mission: Trip, users: HooksUser[]): string => {
  if (!mission.userIds || mission.userIds.length === 0) {
    return 'Aucun chef de groupe';
  }

  // Find the chef de groupe (assuming it's the first user or has a specific role)
  const chefDeGroupeId = mission.userIds[0];
  const chefDeGroupe = users.find(user => user.id.toString() === chefDeGroupeId.toString());
  
  return chefDeGroupe?.name || 'Chef de groupe inconnu';
};

export const getCompanyDisplayText = (mission: Trip): string => {
  if (!mission.company && !mission.branch) {
    return 'Aucune entreprise';
  }
  
  if (mission.branch && mission.company) {
    return `${mission.company} - ${mission.branch}`;
  }
  
  return mission.company || mission.branch || 'Entreprise inconnue';
};

export const getMissionTitle = (mission: Trip, vans: Van[]): string => {
  // Get van reference code (not license plate)
  const van = vans.find(v => v.id === mission.van || v.reference_code === mission.van);
  const vanReference = van?.reference_code || mission.van;
  
  // For now, use van reference as the title (can be enhanced later)
  return vanReference;
};

export const getStatusConfig = (status: string) => {
  switch (status) {
    case 'active':
      return {
        label: 'Active',
        variant: 'default',
        color: 'blue'
      };
    case 'completed':
      return {
        label: 'Terminée',
        variant: 'secondary',
        color: 'emerald'
      };
    case 'cancelled':
      return {
        label: 'Annulée',
        variant: 'destructive',
        color: 'red'
      };
    default:
      return {
        label: 'Inconnue',
        variant: 'outline',
        color: 'gray'
      };
  }
};

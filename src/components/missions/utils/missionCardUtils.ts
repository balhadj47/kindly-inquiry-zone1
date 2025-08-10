
import { Trip } from '@/contexts/TripContext';
import { User } from '@/types/rbac';

export const getDriverName = (mission: Trip, users: User[]): string => {
  if (!mission.driver) return 'Aucun chauffeur';
  
  const driver = users.find(user => user.id.toString() === mission.driver.toString());
  return driver?.name || mission.driver || 'Chauffeur inconnu';
};

export const getChefDeGroupeName = (mission: Trip, users: User[]): string => {
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

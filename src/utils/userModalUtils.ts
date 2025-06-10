
import { UserRole } from '@/types/rbac';

// Helper function to map roles to group IDs
export const getGroupIdForRole = (role: UserRole): string => {
  switch (role) {
    case 'Administrator':
      return 'admin';
    case 'Employee':
      return 'employee';
    case 'Chef de Groupe Armé':
      return 'chef_groupe_arme';
    case 'Chef de Groupe Sans Armé':
      return 'chef_groupe_sans_arme';
    case 'Chauffeur Armé':
      return 'chauffeur_arme';
    case 'Chauffeur Sans Armé':
      return 'chauffeur_sans_arme';
    case 'APS Armé':
      return 'aps_arme';
    case 'APS Sans Armé':
      return 'aps_sans_arme';
    default:
      return 'employee';
  }
};

export const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const isDriverRole = (role: UserRole): boolean => {
  return role === 'Chauffeur Armé' || role === 'Chauffeur Sans Armé';
};

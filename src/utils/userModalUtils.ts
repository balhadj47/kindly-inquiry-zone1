
import { UserRole } from '@/types/rbac';

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

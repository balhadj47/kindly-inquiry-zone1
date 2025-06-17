
import { SystemGroupName } from '@/types/systemGroups';

export const getUserInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const isDriverRole = (systemGroup: SystemGroupName): boolean => {
  // Check if the system group name includes driver-related terms
  const groupStr = systemGroup.toString().toLowerCase();
  return groupStr.includes('chauffeur') || groupStr.includes('driver');
};

import { SystemGroupName } from './systemGroups';
import { MissionRole } from './missionRoles';

export type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Récupération' | 'Congé' | 'Congé maladie';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  systemGroup: SystemGroupName; // Changed from 'role' to be clearer
  missionRole?: MissionRole; // Optional mission role for trips
  status: UserStatus;
  createdAt: string;
  licenseNumber?: string;
  totalTrips?: number;
  lastTrip?: string;
  profileImage?: string;
  // Backward compatibility - add a getter for role
  get role(): SystemGroupName;
}

// Re-export system group types for backward compatibility
export type { SystemGroup as Role, SystemGroupName as UserRole, Permission } from './systemGroups';
export type { MissionRole } from './missionRoles';

// For backward compatibility, keep these empty
export const AVAILABLE_PERMISSIONS: Permission[] = [];
export const DEFAULT_PERMISSIONS = AVAILABLE_PERMISSIONS;
export const DEFAULT_ROLES: SystemGroup[] = [];


export type UserRole = 
  | 'Administrator'
  | 'Supervisor' 
  | 'Driver'
  | 'Security'
  | 'Employee'
  | 'Chef de Groupe Armé'
  | 'Chef de Groupe Sans Armé'
  | 'Chauffeur Armé'
  | 'Chauffeur Sans Armé'
  | 'APS Armé'
  | 'APS Sans Armé';

export type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Récupération' | 'Congé' | 'Congé maladie';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  licenseNumber?: string;
  totalTrips?: number;
  lastTrip?: string;
  profileImage?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
  isSystemRole: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

// Empty arrays - no demo data
export const AVAILABLE_PERMISSIONS: Permission[] = [];
export const DEFAULT_PERMISSIONS = AVAILABLE_PERMISSIONS;
export const DEFAULT_ROLES: Role[] = [];

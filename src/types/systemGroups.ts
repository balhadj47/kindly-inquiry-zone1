
export type SystemGroupName = 
  | 'Administrator'
  | 'Supervisor' 
  | 'Employee';

export interface SystemGroup {
  id: string;
  name: SystemGroupName;
  description: string;
  permissions: string[];
  color: string;
  isSystemRole: boolean;
  role_id?: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

// Remove hardcoded groups - now loaded from database only
export const DEFAULT_SYSTEM_GROUPS: SystemGroup[] = [];

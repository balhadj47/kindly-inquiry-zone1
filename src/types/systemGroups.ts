
export type SystemGroupName = string; // Allow any string from database

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

// No hardcoded groups - everything comes from database
export const DEFAULT_SYSTEM_GROUPS: SystemGroup[] = [];

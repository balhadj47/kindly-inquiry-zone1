
export type MissionRole = 'Chef de Groupe' | 'Chauffeur' | 'APS' | 'Armé';

export interface MissionRoleInfo {
  id: string;
  name: MissionRole;
  description: string;
  category: 'leadership' | 'driver' | 'security' | 'armed';
}

export const MISSION_ROLES: MissionRoleInfo[] = [
  { id: 'chef-groupe', name: 'Chef de Groupe', description: 'Chef de groupe', category: 'leadership' },
  { id: 'chauffeur', name: 'Chauffeur', description: 'Chauffeur', category: 'driver' },
  { id: 'aps', name: 'APS', description: 'Agent de protection et de sécurité', category: 'security' },
  { id: 'arme', name: 'Armé', description: 'Personnel armé', category: 'armed' },
];


export type MissionRole = 
  | 'Driver'
  | 'Security'
  | 'Chef de Groupe Armé'
  | 'Chef de Groupe Sans Armé'
  | 'Chauffeur Armé'
  | 'Chauffeur Sans Armé'
  | 'APS Armé'
  | 'APS Sans Armé';

export interface MissionRoleInfo {
  id: string;
  name: MissionRole;
  description: string;
  category: 'driver' | 'security' | 'leadership';
}

export const MISSION_ROLES: MissionRoleInfo[] = [
  { id: 'driver', name: 'Driver', description: 'Chauffeur standard', category: 'driver' },
  { id: 'security', name: 'Security', description: 'Agent de sécurité', category: 'security' },
  { id: 'chef-arme', name: 'Chef de Groupe Armé', description: 'Chef de groupe avec arme', category: 'leadership' },
  { id: 'chef-sans-arme', name: 'Chef de Groupe Sans Armé', description: 'Chef de groupe sans arme', category: 'leadership' },
  { id: 'chauffeur-arme', name: 'Chauffeur Armé', description: 'Chauffeur avec arme', category: 'driver' },
  { id: 'chauffeur-sans-arme', name: 'Chauffeur Sans Armé', description: 'Chauffeur sans arme', category: 'driver' },
  { id: 'aps-arme', name: 'APS Armé', description: 'Agent de protection avec arme', category: 'security' },
  { id: 'aps-sans-arme', name: 'APS Sans Armé', description: 'Agent de protection sans arme', category: 'security' },
];


// Mission-specific roles for operational assignments
export type MissionRole = 'Chef de Groupe' | 'Chauffeur' | 'APS' | 'Armé';

export interface MissionRoleInfo {
  id: string;
  name: MissionRole;
  description: string;
  category: 'leadership' | 'driver' | 'security' | 'armed';
}

export const MISSION_ROLES: MissionRoleInfo[] = [
  {
    id: 'chef-groupe',
    name: 'Chef de Groupe',
    description: 'Responsable de l\'équipe sur le terrain',
    category: 'leadership'
  },
  {
    id: 'chauffeur',
    name: 'Chauffeur',
    description: 'Conduit les véhicules de transport',
    category: 'driver'
  },
  {
    id: 'aps',
    name: 'APS',
    description: 'Agent de Protection et de Sécurité',
    category: 'security'
  },
  {
    id: 'arme',
    name: 'Armé',
    description: 'Agent armé pour la sécurité renforcée',
    category: 'armed'
  }
];

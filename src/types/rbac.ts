
export type UserRole = 
  | 'Administrator'
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
  groupId: string;
  createdAt: string;
  licenseNumber?: string;
  totalTrips?: number;
  lastTrip?: string;
  profileImage?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  color: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const AVAILABLE_PERMISSIONS: Permission[] = [
  // User Management
  { id: 'users:read', name: 'Voir les utilisateurs', description: 'Peut voir la liste des utilisateurs', category: 'Gestion des Utilisateurs' },
  { id: 'users:create', name: 'Créer des utilisateurs', description: 'Peut créer de nouveaux utilisateurs', category: 'Gestion des Utilisateurs' },
  { id: 'users:update', name: 'Modifier les utilisateurs', description: 'Peut modifier les informations des utilisateurs', category: 'Gestion des Utilisateurs' },
  { id: 'users:delete', name: 'Supprimer les utilisateurs', description: 'Peut supprimer des utilisateurs', category: 'Gestion des Utilisateurs' },
  
  // Group Management
  { id: 'groups:read', name: 'Voir les groupes', description: 'Peut voir la liste des groupes', category: 'Gestion des Groupes' },
  { id: 'groups:create', name: 'Créer des groupes', description: 'Peut créer de nouveaux groupes', category: 'Gestion des Groupes' },
  { id: 'groups:update', name: 'Modifier les groupes', description: 'Peut modifier les groupes existants', category: 'Gestion des Groupes' },
  { id: 'groups:delete', name: 'Supprimer les groupes', description: 'Peut supprimer des groupes', category: 'Gestion des Groupes' },
  
  // Van Management
  { id: 'vans:read', name: 'Voir les camionnettes', description: 'Peut voir la liste des camionnettes', category: 'Gestion des Camionnettes' },
  { id: 'vans:create', name: 'Créer des camionnettes', description: 'Peut ajouter de nouvelles camionnettes', category: 'Gestion des Camionnettes' },
  { id: 'vans:update', name: 'Modifier les camionnettes', description: 'Peut modifier les informations des camionnettes', category: 'Gestion des Camionnettes' },
  { id: 'vans:delete', name: 'Supprimer les camionnettes', description: 'Peut supprimer des camionnettes', category: 'Gestion des Camionnettes' },
  
  // Trip Management
  { id: 'trips:read', name: 'Voir les voyages', description: 'Peut voir l\'historique des voyages', category: 'Gestion des Voyages' },
  { id: 'trips:create', name: 'Créer des voyages', description: 'Peut enregistrer de nouveaux voyages', category: 'Gestion des Voyages' },
  { id: 'trips:update', name: 'Modifier les voyages', description: 'Peut modifier les informations des voyages', category: 'Gestion des Voyages' },
  { id: 'trips:delete', name: 'Supprimer les voyages', description: 'Peut supprimer des voyages', category: 'Gestion des Voyages' },
  
  // Company Management
  { id: 'companies:read', name: 'Voir les entreprises', description: 'Peut voir la liste des entreprises', category: 'Gestion des Entreprises' },
  { id: 'companies:create', name: 'Créer des entreprises', description: 'Peut ajouter de nouvelles entreprises', category: 'Gestion des Entreprises' },
  { id: 'companies:update', name: 'Modifier les entreprises', description: 'Peut modifier les informations des entreprises', category: 'Gestion des Entreprises' },
  { id: 'companies:delete', name: 'Supprimer les entreprises', description: 'Peut supprimer des entreprises', category: 'Gestion des Entreprises' },
  
  // Dashboard
  { id: 'dashboard:read', name: 'Voir le tableau de bord', description: 'Peut accéder au tableau de bord', category: 'Tableau de Bord' },
  
  // Settings
  { id: 'settings:read', name: 'Voir les paramètres', description: 'Peut voir les paramètres du système', category: 'Paramètres' },
  { id: 'settings:update', name: 'Modifier les paramètres', description: 'Peut modifier les paramètres du système', category: 'Paramètres' },
];

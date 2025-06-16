
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

export const AVAILABLE_PERMISSIONS: Permission[] = [
  // User Management
  { id: 'users:read', name: 'Voir les utilisateurs', description: 'Peut voir la liste des utilisateurs', category: 'Gestion des Utilisateurs' },
  { id: 'users:create', name: 'Créer des utilisateurs', description: 'Peut créer de nouveaux utilisateurs', category: 'Gestion des Utilisateurs' },
  { id: 'users:update', name: 'Modifier les utilisateurs', description: 'Peut modifier les informations des utilisateurs', category: 'Gestion des Utilisateurs' },
  { id: 'users:delete', name: 'Supprimer les utilisateurs', description: 'Peut supprimer des utilisateurs', category: 'Gestion des Utilisateurs' },
  
  // Role Management
  { id: 'roles:read', name: 'Voir les rôles', description: 'Peut voir la liste des rôles', category: 'Gestion des Rôles' },
  { id: 'roles:create', name: 'Créer des rôles', description: 'Peut créer de nouveaux rôles', category: 'Gestion des Rôles' },
  { id: 'roles:update', name: 'Modifier les rôles', description: 'Peut modifier les rôles existants', category: 'Gestion des Rôles' },
  { id: 'roles:delete', name: 'Supprimer les rôles', description: 'Peut supprimer des rôles', category: 'Gestion des Rôles' },
  
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

export const DEFAULT_PERMISSIONS = AVAILABLE_PERMISSIONS;

// Default system roles
export const DEFAULT_ROLES: Role[] = [
  {
    id: 'administrator',
    name: 'Administrateur',
    description: 'Accès complet au système',
    permissions: [
      'users:read', 'users:create', 'users:update', 'users:delete',
      'roles:read', 'roles:create', 'roles:update', 'roles:delete',
      'vans:read', 'vans:create', 'vans:update', 'vans:delete',
      'trips:read', 'trips:create', 'trips:update', 'trips:delete',
      'companies:read', 'companies:create', 'companies:update', 'companies:delete',
      'dashboard:read', 'settings:read', 'settings:update'
    ],
    color: 'bg-red-100 text-red-800',
    isSystemRole: true
  },
  {
    id: 'supervisor',
    name: 'Superviseur',
    description: 'Supervision des opérations',
    permissions: ['dashboard:read', 'trips:read', 'trips:create', 'trips:update', 'vans:read', 'users:read'],
    color: 'bg-yellow-100 text-yellow-800',
    isSystemRole: true
  },
  {
    id: 'driver',
    name: 'Chauffeur',
    description: 'Conducteur de véhicules',
    permissions: ['dashboard:read', 'trips:read', 'trips:create', 'vans:read'],
    color: 'bg-green-100 text-green-800',
    isSystemRole: true
  },
  {
    id: 'security',
    name: 'Sécurité',
    description: 'Personnel de sécurité',
    permissions: ['dashboard:read', 'trips:read', 'trips:create'],
    color: 'bg-purple-100 text-purple-800',
    isSystemRole: true
  },
  {
    id: 'employee',
    name: 'Employé',
    description: 'Employé standard',
    permissions: ['dashboard:read', 'trips:read'],
    color: 'bg-blue-100 text-blue-800',
    isSystemRole: true
  }
];

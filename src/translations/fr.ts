
import { TranslationKeys } from '@/types/language';

export const fr: TranslationKeys = {
  // Navigation
  dashboard: 'Tableau de Bord',
  companies: 'Entreprises',
  vansDrivers: 'Camionnettes et Chauffeurs',
  users: 'Utilisateurs',
  logTrip: 'Enregistrer Voyage',
  tripHistory: 'Historique des Voyages',
  settings: 'Paramètres',
  
  // Common
  search: 'Rechercher',
  add: 'Ajouter',
  edit: 'Modifier',
  save: 'Sauvegarder',
  cancel: 'Annuler',
  delete: 'Supprimer',
  loading: 'Chargement',
  error: 'Erreur',
  success: 'Succès',
  
  // Dashboard
  totalTrips: 'Total des Voyages',
  activeVans: 'Camionnettes Actives',
  totalBranches: 'Total des Succursales',
  recentActivity: 'Activité Récente',
  
  // Companies
  addNewCompany: 'Ajouter Nouvelle Entreprise',
  searchCompanies: 'Rechercher des entreprises...',
  branches: 'Succursales',
  lastActivity: 'Dernière Activité',
  
  // Trip Logger
  tripLogger: 'Enregistreur de Voyage',
  recordVanVisits: 'Enregistrer les visites de camionnettes aux succursales',
  currentTime: 'Heure Actuelle',
  logNewTrip: 'Nouveau Voyage',
  selectVan: 'Sélectionner Camionnette',
  chooseVan: 'Choisir une camionnette',
  selectCompany: 'Sélectionner Entreprise',
  chooseCompany: 'Choisir une entreprise',
  selectBranch: 'Sélectionner Succursale',
  chooseBranch: 'Choisir une succursale',
  selectCompanyFirst: 'Sélectionner d\'abord l\'entreprise',
  notes: 'Notes (Optionnel)',
  notesPlaceholder: 'Notes supplémentaires sur ce voyage...',
  logTripVisit: 'Enregistrer la Visite',
  tripsToday: 'Voyages Aujourd\'hui',
  
  // Trip History
  filterByCompany: 'Filtrer par Entreprise',
  filterByVan: 'Filtrer par Camionnette',
  allCompanies: 'Toutes les Entreprises',
  allVans: 'Toutes les Camionnettes',
  noTripsFound: 'Aucun voyage trouvé',
  timeAgo: {
    minsAgo: 'min',
    hoursAgo: 'h',
    daysAgo: 'j',
  },
  
  // User Status
  userStatus: {
    active: 'Active',
    recovery: 'Récupération',
    leave: 'Congé',
    sickLeave: 'Congé maladie',
  },

  // Users Management
  usersManagement: 'Gestion des Utilisateurs',
  addNewUser: 'Ajouter Nouvel Utilisateur',
  addGroup: 'Ajouter Groupe',
  groups: 'Groupes',
  filterByStatus: 'Filtrer par statut',
  filterByRole: 'Filtrer par rôle',
  filterByGroup: 'Filtrer par groupe',
  allStatuses: 'Tous les Statuts',
  allRoles: 'Tous les Rôles',
  allGroups: 'Tous les Groupes',
  clearFilters: 'Effacer les Filtres',
  showingUsers: 'Affichage de',
  of: 'sur',
  filtered: '(filtré)',
  activeFilters: 'Filtres actifs:',
  searchByNameEmailLicense: 'Rechercher par nom, email, ou numéro de licence...',
  noUsersFound: 'Aucun utilisateur trouvé',
  tryAdjustingFilters: 'Essayez d\'ajuster vos filtres ou termes de recherche.',
  tryAdjustingSearch: 'Essayez d\'ajuster vos termes de recherche ou ajoutez un nouvel utilisateur.',
  clearAllFilters: 'Effacer tous les filtres',
  viewHistory: 'Voir l\'Historique',
  totalTripsLabel: 'Total des Voyages:',
  lastTripLabel: 'Dernier Voyage:',
  permissions: 'Permissions',
  cannotDeleteGroup: 'Impossible de supprimer le groupe',
  usersAssigned: 'utilisateur(s) assigné(s). Veuillez réassigner ces utilisateurs à un autre groupe d\'abord.',
  reassignUsers: 'Veuillez réassigner ces utilisateurs à un autre groupe d\'abord.',
  cannotDeleteDefault: 'Impossible de supprimer le groupe par défaut',
  confirmDeleteGroup: 'Êtes-vous sûr de vouloir supprimer le groupe',
  actionCannotBeUndone: 'Cette action ne peut pas être annulée.',
  loadingUsers: 'Chargement des utilisateurs...',
  noGroupsFound: 'Aucun groupe trouvé',
  createFirstGroup: 'Créez votre premier groupe d\'utilisateurs pour commencer.',
  isDefaultGroup: 'Ceci est un groupe par défaut et ne peut pas être supprimé.',
  cannotDelete: 'Impossible de supprimer:',
};

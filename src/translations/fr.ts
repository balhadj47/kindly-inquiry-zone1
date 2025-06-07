
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
};

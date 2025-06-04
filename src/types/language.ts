
export type SupportedLanguage = 'en' | 'fr' | 'ar';

export interface TranslationKeys {
  // Navigation
  dashboard: string;
  companies: string;
  vansDrivers: string;
  users: string;
  logTrip: string;
  tripHistory: string;
  
  // Common
  search: string;
  add: string;
  edit: string;
  save: string;
  cancel: string;
  delete: string;
  loading: string;
  error: string;
  success: string;
  
  // Dashboard
  totalTrips: string;
  activeVans: string;
  totalBranches: string;
  recentActivity: string;
  
  // Companies
  addNewCompany: string;
  searchCompanies: string;
  branches: string;
  lastActivity: string;
  
  // Trip Logger
  tripLogger: string;
  recordVanVisits: string;
  currentTime: string;
  logNewTrip: string;
  selectVan: string;
  chooseVan: string;
  selectCompany: string;
  chooseCompany: string;
  selectBranch: string;
  chooseBranch: string;
  selectCompanyFirst: string;
  notes: string;
  notesPlaceholder: string;
  logTripVisit: string;
  tripsToday: string;
  
  // Trip History
  filterByCompany: string;
  filterByVan: string;
  allCompanies: string;
  allVans: string;
  noTripsFound: string;
  timeAgo: {
    minsAgo: string;
    hoursAgo: string;
    daysAgo: string;
  };
}


export type SupportedLanguage = 'en' | 'fr' | 'ar';

export interface TranslationKeys {
  // Navigation
  dashboard: string;
  companies: string;
  vansDrivers: string;
  users: string;
  logTrip: string;
  tripHistory: string;
  settings: string;
  
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
  
  // Auth
  signOut: string;
  logout: string;
  
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
  companyName: string;
  enterCompanyName: string;
  currentBranches: string;
  enterBranchName: string;
  addBranch: string;
  editCompany: string;
  createCompany: string;
  updateCompany: string;
  more: string;
  
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
  
  // User Status
  userStatus: {
    active: string;
    recovery: string;
    leave: string;
    sickLeave: string;
  };

  // Users Management
  usersManagement: string;
  addNewUser: string;
  addGroup: string;
  groups: string;
  filterByStatus: string;
  filterByRole: string;
  filterByGroup: string;
  allStatuses: string;
  allRoles: string;
  allGroups: string;
  clearFilters: string;
  showingUsers: string;
  of: string;
  filtered: string;
  activeFilters: string;
  searchByNameEmailLicense: string;
  noUsersFound: string;
  tryAdjustingFilters: string;
  tryAdjustingSearch: string;
  clearAllFilters: string;
  viewHistory: string;
  totalTripsLabel: string;
  lastTripLabel: string;
  permissions: string;
  cannotDeleteGroup: string;
  usersAssigned: string;
  reassignUsers: string;
  cannotDeleteDefault: string;
  confirmDeleteGroup: string;
  actionCannotBeUndone: string;
  loadingUsers: string;
  noGroupsFound: string;
  createFirstGroup: string;
  isDefaultGroup: string;
  cannotDelete: string;

  // Van Management
  addNewVan: string;
  editVan: string;
  plateNumber: string;
  carNumberPlate: string;
  vanModel: string;
  status: string;
  insuranceDate: string;
  controlDate: string;
  insurer: string;
  pickInsuranceDate: string;
  pickControlDate: string;
  additionalNotes: string;
  createVan: string;
  updateVan: string;
  vanStatuses: {
    active: string;
    inTransit: string;
    maintenance: string;
    inactive: string;
  };
  
  // Common placeholders and labels
  required: string;
  optional: string;
  pleaseSelect: string;
  selectStatus: string;
  addNotesPlaceholder: string;
  fillRequiredFields: string;
  vanNotFound: string;
  companyNotFound: string;
  branchNotFound: string;
  tripLoggedSuccessfully: string;
  
  // Trip History additional
  searchTrips: string;
  filterBy: string;
  allTrips: string;
  byVan: string;
  byCompany: string;
  byBranch: string;
  dateRange: string;
  today: string;
  thisWeek: string;
  thisMonth: string;
  allTime: string;
  export: string;
  totalTripsCount: string;
  uniqueVans: string;
  companiesCount: string;
  branchesCount: string;
  recentTrips: string;
  noTripsFoundMessage: string;
  viewDetails: string;
}

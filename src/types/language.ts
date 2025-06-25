
export type Language = 'en' | 'fr' | 'ar';
export type SupportedLanguage = 'en' | 'fr' | 'ar';

export interface TranslationKeys {
  // Navigation
  dashboard: string;
  companies: string;
  vansDrivers: string;
  users: string;
  employees: string;
  comptes: string;
  logTrip: string;
  tripHistory: string;
  settings: string;
  
  // Navigation - Mobile specific
  home: string;
  vans: string;
  logger: string;
  history: string;
  
  // Navigation - Sidebar specific
  dashboardFull: string;
  logTripFull: string;
  
  // Success messages
  companyDeletedSuccessfully: string;
  
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
  and: string;
  address: string;
  phone: string;
  email: string;
  enterAddress: string;
  enterPhone: string;
  enterEmail: string;
  manageCompaniesAndBranches: string;
  
  // Branch Management
  addNewBranch: string;
  editBranch: string;
  deleteBranch: string;
  deleteBranchConfirmation: string;
  branchName: string;
  updateBranch: string;
  createBranch: string;
  addFirstBranch: string;
  
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
  vansManagement: string;
  manageYourFleet: string;
  noVansFound: string;
  tryAdjustingSearch: string;
  startByAddingFirstVan: string;
  addYourFirstVan: string;
  tryAdjustingFiltersOrSearch: string;
  vansLabel: string;
  addNewVanTooltip: string;
  
  vanStatuses: {
    active: string;
    inTransit: string;
    maintenance: string;
    inactive: string;
  };
  
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

  // Additional translations for missing strings
  companyInformation: string;
  branchDetails: string;
  companyContext: string;
  companyAddress: string;
  totalBranchesLabel: string;
  branchAge: string;
  daysOld: string;
  activeBranch: string;
  backTo: string;
  closeDetails: string;
  branchId: string;
  createdDate: string;
  noAddressProvided: string;
  noPhoneProvided: string;
  noEmailProvided: string;
  branchOf: string;
  companyStatus: string;
  yearsActive: string;
  branchType: string;
  multi: string;
  single: string;
  noBranchesAvailable: string;
  created: string;
  back: string;
  companyNotFoundMessage: string;
  branchNotFoundMessage: string;
  backToCompanies: string;
  noAddress: string;
  noPhone: string;
  noEmail: string;
  noBranches: string;
  companyNotFoundFull: string;
  unableToFindCompany: string;
  branchNotFoundFull: string;
  unableToFindBranch: string;
  createdOn: string;
  company: string;
  modify: string;
  clear: string;
  filters: string;
  searchByCompanyBranchVan: string;
  allCompaniesFilter: string;
  allVansFilter: string;
  thisWeekTrips: string;
  companiesVisited: string;
  noTripsFoundFull: string;
  noTripsRecorded: string;
  noTripsMatchFilters: string;
  licenseNumber: string;
  totalTripsDriver: string;
  lastTrip: string;
  cannotDeleteGroupHasUsers: string;
  defaultGroupCannotDelete: string;
  deleteGroup: string;
  deleteGroupConfirm: string;
  noCompanyFoundMessage: string;
  addFirstCompany: string;
  addYourFirstCompany: string;
  confirmDeletion: string;
  areYouSureDelete: string;
  thisWillAlsoDelete: string;
  branch: string;
  thisActionIsIrreversible: string;
  deleting: string;
  saving: string;
  referenceCode: string;
  
  // Missing translations from TripDates component
  plannedDates: string;
  startDate: string;
  endDate: string;
  
  // Missing translations from TripHistoryHeader
  reviewAllTrips: string;
  
  // Missing translations from TripHistoryFilters
  advancedFilters: string;
  van: string;
  
  // Missing translations from form validation
  incompleteStep: string;
  selectVehicleAndKm: string;
  selectCompanyAndBranch: string;
  selectAtLeastOneUser: string;
  startDateMustBeBeforeEnd: string;
}


import { TranslationKeys } from '@/types/language';

export const en: TranslationKeys = {
  // Navigation
  dashboard: 'Dashboard',
  companies: 'Companies',
  vansDrivers: 'Vans & Drivers',
  users: 'Users',
  logTrip: 'Log Trip',
  tripHistory: 'Trip History',
  settings: 'Settings',
  
  // Common
  search: 'Search',
  add: 'Add',
  edit: 'Edit',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  loading: 'Loading',
  error: 'Error',
  success: 'Success',
  
  // Dashboard
  totalTrips: 'Total Trips',
  activeVans: 'Active Vans',
  totalBranches: 'Total Branches',
  recentActivity: 'Recent Activity',
  
  // Companies
  addNewCompany: 'Add New Company',
  searchCompanies: 'Search companies...',
  branches: 'Branches',
  lastActivity: 'Last Activity',
  
  // Trip Logger
  tripLogger: 'Trip Logger',
  recordVanVisits: 'Record van visits to company branches',
  currentTime: 'Current Time',
  logNewTrip: 'Log New Trip',
  selectVan: 'Select Van',
  chooseVan: 'Choose a van',
  selectCompany: 'Select Company',
  chooseCompany: 'Choose a company',
  selectBranch: 'Select Branch',
  chooseBranch: 'Choose a branch',
  selectCompanyFirst: 'Select company first',
  notes: 'Notes (Optional)',
  notesPlaceholder: 'Any additional notes about this trip...',
  logTripVisit: 'Log Trip Visit',
  tripsToday: 'Trips Today',
  
  // Trip History
  filterByCompany: 'Filter by Company',
  filterByVan: 'Filter by Van',
  allCompanies: 'All Companies',
  allVans: 'All Vans',
  noTripsFound: 'No trips found',
  timeAgo: {
    minsAgo: 'mins ago',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
  },
  
  // User Status
  userStatus: {
    active: 'Active',
    recovery: 'Recovery',
    leave: 'Leave',
    sickLeave: 'Sick Leave',
  },

  // Users Management
  usersManagement: 'Users Management',
  addNewUser: 'Add New User',
  addGroup: 'Add Group',
  groups: 'Groups',
  filterByStatus: 'Filter by status',
  filterByRole: 'Filter by role',
  filterByGroup: 'Filter by group',
  allStatuses: 'All Statuses',
  allRoles: 'All Roles',
  allGroups: 'All Groups',
  clearFilters: 'Clear Filters',
  showingUsers: 'Showing',
  of: 'of',
  filtered: '(filtered)',
  activeFilters: 'Active filters:',
  searchByNameEmailLicense: 'Search by name, email, or license number...',
  noUsersFound: 'No users found',
  tryAdjustingFilters: 'Try adjusting your filters or search terms.',
  tryAdjustingSearch: 'Try adjusting your search terms or add a new user.',
  clearAllFilters: 'Clear all filters',
  viewHistory: 'View History',
  totalTripsLabel: 'Total Trips:',
  lastTripLabel: 'Last Trip:',
  permissions: 'Permissions',
  cannotDeleteGroup: 'Cannot delete group',
  usersAssigned: 'user(s) assigned to it. Please reassign these users to another group first.',
  reassignUsers: 'Please reassign these users to another group first.',
  cannotDeleteDefault: 'Cannot delete the default group',
  confirmDeleteGroup: 'Are you sure you want to delete the group',
  actionCannotBeUndone: 'This action cannot be undone.',
  loadingUsers: 'Loading users...',
  noGroupsFound: 'No groups found',
  createFirstGroup: 'Create your first user group to get started.',
  isDefaultGroup: 'This is a default group and cannot be deleted.',
  cannotDelete: 'Cannot delete:',
};

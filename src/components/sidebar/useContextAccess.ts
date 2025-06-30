
import { useRBAC } from '@/contexts/RBACContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const useContextAccess = () => {
  console.log('🔍 useContextAccess: Starting context access...');
  
  // Safe RBAC context access
  let hasPermission: (permission: string) => boolean = () => false;
  let currentUser: any = null;
  let loading = true;
  let roles: any[] = [];
  
  try {
    const rbacContext = useRBAC();
    if (rbacContext && typeof rbacContext === 'object') {
      hasPermission = rbacContext.hasPermission || (() => false);
      currentUser = rbacContext.currentUser;
      loading = rbacContext.loading;
      roles = Array.isArray(rbacContext.roles) ? rbacContext.roles : [];
      console.log('🔍 useContextAccess: RBAC context loaded successfully');
    } else {
      console.warn('🔍 useContextAccess: RBAC context not available');
    }
  } catch (error) {
    console.warn('🔍 useContextAccess: RBAC context access error:', error?.message || 'Unknown error');
  }
  
  // Safe Language context access
  let t: any = {
    dashboard: 'Dashboard',
    logTrip: 'Log Trip',
    missions: 'Missions',
    companies: 'Companies',
    authUsers: 'Auth Users',
    vans: 'Vans',
    employees: 'Employees'
  };
  
  try {
    const languageContext = useLanguage();
    if (languageContext && typeof languageContext === 'object' && languageContext.t) {
      t = languageContext.t;
      console.log('🔍 useContextAccess: Language context loaded successfully');
    } else {
      console.warn('🔍 useContextAccess: Language context not available, using defaults');
    }
  } catch (error) {
    console.warn('🔍 useContextAccess: Language context access error:', error?.message || 'Unknown error');
  }

  return {
    hasPermission,
    currentUser,
    loading,
    roles,
    t
  };
};


import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRBACStateClean } from './useRBACStateClean';
import { useRBACOperations } from './useRBACOperations';
import { useRBACDataInit } from './useRBACDataInit';
import { loadRolesFromDatabase } from '@/utils/roleUtils';
import { RBACContext } from './context';
import type { RBACContextType, RBACProviderProps } from './types';

export const RBACProvider: React.FC<RBACProviderProps> = ({ children }) => {
  console.log('🔄 RBACProvider: Initializing...');
  
  const { user: authUser } = useAuth();
  const [rolesLoaded, setRolesLoaded] = useState(false);
  
  // Initialize RBAC state - now returns flat structure
  const rbacState = useRBACStateClean();
  
  // Initialize roles from database on provider mount
  useEffect(() => {
    const initializeRoles = async () => {
      console.log('🔄 RBACProvider: Loading roles from database...');
      try {
        await loadRolesFromDatabase();
        console.log('✅ RBACProvider: Roles loaded from database');
        setRolesLoaded(true);
      } catch (error) {
        console.error('❌ RBACProvider: Error loading roles:', error);
        setRolesLoaded(true); // Continue even if roles fail to load
      }
    };
    
    initializeRoles();
  }, []);

  // Initialize RBAC data after roles are loaded
  useRBACDataInit({ 
    currentUser: rbacState.currentUser,
    users: rbacState.users,
    roles: rbacState.roles,
    permissions: rbacState.permissions,
    loading: rbacState.loading,
    setCurrentUser: rbacState.setCurrentUser,
    setUsers: rbacState.setUsers,
    setRoles: rbacState.setRoles,
    setPermissions: rbacState.setPermissions,
    setLoading: rbacState.setLoading,
    rolesLoaded // Pass rolesLoaded flag to ensure proper initialization order
  });

  // Create operations
  const operations = useRBACOperations({
    currentUser: rbacState.currentUser,
    roles: rbacState.roles,
    setUsers: rbacState.setUsers,
    setRoles: rbacState.setRoles,
  });

  // Wait for both RBAC data and roles to be loaded
  if (rbacState.loading || !rolesLoaded) {
    console.log('🔄 RBACProvider: Still loading...', { loading: rbacState.loading, rolesLoaded });
    return (
      <RBACContext.Provider value={{
        currentUser: null,
        users: [],
        roles: [],
        permissions: [],
        loading: true,
        setUser: () => {},
        ...operations,
      }}>
        {children}
      </RBACContext.Provider>
    );
  }

  const contextValue: RBACContextType = {
    currentUser: rbacState.currentUser,
    users: rbacState.users,
    roles: rbacState.roles,
    permissions: rbacState.permissions,
    loading: rbacState.loading,
    setUser: rbacState.setCurrentUser,
    ...operations,
  };

  console.log('✅ RBACProvider: Context ready', {
    currentUser: rbacState.currentUser?.id,
    usersCount: rbacState.users.length,
    rolesCount: rbacState.roles.length,
    permissionsCount: rbacState.permissions.length,
  });

  return (
    <RBACContext.Provider value={contextValue}>
      {children}
    </RBACContext.Provider>
  );
};

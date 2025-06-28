
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
  
  // Initialize RBAC state
  const { state, actions } = useRBACStateClean();
  
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
    state, 
    actions,
    rolesLoaded // Pass rolesLoaded flag to ensure proper initialization order
  });

  // Create operations
  const operations = useRBACOperations({
    currentUser: state.currentUser,
    roles: state.roles,
    setUsers: actions.setUsers,
    setRoles: actions.setRoles,
  });

  // Wait for both RBAC data and roles to be loaded
  if (state.loading || !rolesLoaded) {
    console.log('🔄 RBACProvider: Still loading...', { loading: state.loading, rolesLoaded });
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
    currentUser: state.currentUser,
    users: state.users,
    roles: state.roles,
    permissions: state.permissions,
    loading: state.loading,
    setUser: actions.setCurrentUser,
    ...operations,
  };

  console.log('✅ RBACProvider: Context ready', {
    currentUser: state.currentUser?.id,
    usersCount: state.users.length,
    rolesCount: state.roles.length,
    permissionsCount: state.permissions.length,
  });

  return (
    <RBACContext.Provider value={contextValue}>
      {children}
    </RBACContext.Provider>
  );
};

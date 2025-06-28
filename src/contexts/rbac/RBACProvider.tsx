
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createRBACContext } from './context';
import { useRBACDataInit } from './useRBACDataInit';
import { useRBACOperations } from './useRBACOperations';
import { loadRolesFromDatabase } from '@/utils/roleUtils';
import type { RBACContextType, RBACProviderProps } from './types';

const { RBACContext } = createRBACContext();

export const RBACProvider: React.FC<RBACProviderProps> = ({ children }) => {
  console.log('🔄 RBACProvider: Initializing...');
  
  const { user: authUser } = useAuth();
  const [rolesLoaded, setRolesLoaded] = useState(false);
  
  // Initialize roles from database on provider mount
  useEffect(() => {
    const initializeRoles = async () => {
      console.log('🔄 RBACProvider: Loading roles from database...');
      await loadRolesFromDatabase();
      setRolesLoaded(true);
    };
    
    initializeRoles();
  }, []);

  // Initialize RBAC data
  const {
    currentUser,
    users,
    roles,
    permissions,
    loading,
    setUsers,
    setRoles,
    setPermissions,
    setCurrentUser,
    setLoading,
  } = useRBACDataInit(authUser);

  // Create operations
  const operations = useRBACOperations({
    currentUser,
    roles,
    setUsers,
    setRoles,
  });

  // Wait for both RBAC data and roles to be loaded
  if (loading || !rolesLoaded) {
    console.log('🔄 RBACProvider: Still loading...', { loading, rolesLoaded });
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
    currentUser,
    users,
    roles,
    permissions,
    loading,
    setUser: setCurrentUser,
    ...operations,
  };

  console.log('✅ RBACProvider: Context ready', {
    currentUser: currentUser?.id,
    usersCount: users.length,
    rolesCount: roles.length,
    permissionsCount: permissions.length,
  });

  return (
    <RBACContext.Provider value={contextValue}>
      {children}
    </RBACContext.Provider>
  );
};

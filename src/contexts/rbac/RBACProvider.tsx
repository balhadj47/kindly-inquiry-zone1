
import React from 'react';
import { RBACContext } from './context';
import { useRBACStateFinal } from './useRBACStateFinal';
import { useRBACDataInit } from './useRBACDataInit';
import { useRBACOperations } from './useRBACOperations';

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('🔄 RBACProvider: Starting render...');
  
  // Check React availability early
  if (!React || !React.useState) {
    console.error('❌ React hooks not available in RBACProvider');
    return <div>Loading...</div>;
  }

  const {
    currentUser,
    users,
    roles,
    permissions,
    loading,
    setCurrentUser,
    setUsers,
    setRoles,
    setPermissions,
    setLoading,
    setUser,
  } = useRBACStateFinal();

  const state = {
    currentUser,
    users,
    roles,
    permissions,
    loading,
  };

  const actions = {
    setUsers,
    setRoles,
    setPermissions,
    setCurrentUser,
    setLoading,
  };

  useRBACDataInit({ state, actions });

  const operations = useRBACOperations({
    currentUser,
    roles,
    setUsers,
    setRoles,
  });

  console.log('✅ RBACProvider: Rendering context with operations');

  return (
    <RBACContext.Provider value={{
      currentUser,
      users,
      roles,
      permissions,
      loading,
      setUser,
      ...operations,
    }}>
      {children}
    </RBACContext.Provider>
  );
};


import React from 'react';
import { RBACContext } from './context';
import { useRBACState } from './useRBACState';
import { useRBACDataInit } from './useRBACDataInit';
import { useRBACOperations } from './useRBACOperations';

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
  } = useRBACState();

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

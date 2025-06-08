
import React from 'react';
import { RBACContext } from './context';
import { useRBACState } from './useRBACState';
import { useRBACDataInit } from './useRBACDataInit';
import { useRBACOperations } from './useRBACOperations';

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentUser,
    users,
    groups,
    permissions,
    loading,
    setCurrentUser,
    setUsers,
    setGroups,
    setPermissions,
    setLoading,
    setUser,
  } = useRBACState();

  useRBACDataInit({
    setUsers,
    setGroups,
    setPermissions,
    setCurrentUser,
    setLoading,
  });

  const operations = useRBACOperations({
    currentUser,
    groups,
    setUsers,
    setGroups,
  });

  return (
    <RBACContext.Provider value={{
      currentUser,
      users,
      groups,
      permissions,
      loading,
      setUser,
      ...operations,
    }}>
      {children}
    </RBACContext.Provider>
  );
};

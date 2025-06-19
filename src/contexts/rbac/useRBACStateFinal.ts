
import { useState } from 'react';
import { User, Permission } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

export const useRBACStateFinal = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<SystemGroup[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);  
  const [loading, setLoading] = useState(true);

  console.log('🔄 useRBACStateFinal: Current state:', {
    currentUser: currentUser?.id || 'null',
    usersCount: users.length,
    rolesCount: roles.length,
    loading
  });

  const setUser = (user: User | null) => {
    console.log('🔄 useRBACStateFinal: Setting user:', user?.id || 'null');
    // Add null check to prevent type errors
    if (user && typeof user === 'object') {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  };

  const safeSetUsers = (newUsers: User[]) => {
    // Ensure we have a valid array
    if (Array.isArray(newUsers)) {
      setUsers(newUsers);
    } else {
      console.warn('🔄 useRBACStateFinal: Invalid users data, using empty array');
      setUsers([]);
    }
  };

  const safeSetRoles = (newRoles: SystemGroup[]) => {
    // Ensure we have a valid array
    if (Array.isArray(newRoles)) {
      setRoles(newRoles);
    } else {
      console.warn('🔄 useRBACStateFinal: Invalid roles data, using empty array');
      setRoles([]);
    }
  };

  const safeSetPermissions = (newPermissions: Permission[]) => {
    // Ensure we have a valid array
    if (Array.isArray(newPermissions)) {
      setPermissions(newPermissions);
    } else {
      console.warn('🔄 useRBACStateFinal: Invalid permissions data, using empty array');
      setPermissions([]);
    }
  };

  return {
    currentUser,
    users,
    roles,
    permissions,
    loading,
    setCurrentUser: setUser,
    setUsers: safeSetUsers,
    setRoles: safeSetRoles,
    setPermissions: safeSetPermissions,
    setLoading,
    setUser,
  };
};

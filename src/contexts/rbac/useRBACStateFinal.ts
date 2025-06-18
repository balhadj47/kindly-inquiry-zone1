
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
    currentUser: currentUser?.id,
    usersCount: users.length,
    rolesCount: roles.length,
    loading
  });

  const setUser = (user: User | null) => {
    console.log('🔄 useRBACStateFinal: Setting user:', user?.id);
    setCurrentUser(user);
  };

  return {
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
  };
};

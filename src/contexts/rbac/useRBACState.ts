
import { useState } from 'react';
import type { User, UserGroup, Permission } from '@/types/rbac';

export const useRBACState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const setUser = (user: User | null) => {
    setCurrentUser(user);
  };

  return {
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
  };
};


import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserGroup, Permission, DEFAULT_GROUPS, DEFAULT_PERMISSIONS } from '@/types/rbac';

interface RBACContextType {
  currentUser: User | null;
  users: User[];
  groups: UserGroup[];
  permissions: Permission[];
  hasPermission: (permissionId: string) => boolean;
  hasAnyPermission: (permissionIds: string[]) => boolean;
  getUserGroup: (groupId: string) => UserGroup | undefined;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: number, user: Partial<User>) => void;
  deleteUser: (id: number) => void;
  addGroup: (group: Omit<UserGroup, 'id'>) => void;
  updateGroup: (id: string, group: Partial<UserGroup>) => void;
  deleteGroup: (id: string) => void;
  setCurrentUser: (user: User | null) => void;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within a RBACProvider');
  }
  return context;
};

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // For demo purposes, we'll use a mock admin user
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 1,
    name: 'Admin User',
    email: 'admin@company.com',
    phone: '+1 (555) 000-0000',
    role: 'Administrator',
    groupId: 'admin',
    status: 'Active',
    createdAt: new Date().toISOString(),
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      role: 'Driver',
      groupId: 'driver',
      status: 'Active',
      licenseNumber: 'DL123456789',
      totalTrips: 45,
      lastTrip: '2 hours ago',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 987-6543',
      role: 'Employee',
      groupId: 'employee',
      status: 'Active',
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@company.com',
      phone: '+1 (555) 456-7890',
      role: 'Driver',
      groupId: 'driver',
      status: 'Inactive',
      licenseNumber: 'DL456789123',
      totalTrips: 52,
      lastTrip: '1 day ago',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [groups, setGroups] = useState<UserGroup[]>(DEFAULT_GROUPS);
  const [permissions] = useState<Permission[]>(DEFAULT_PERMISSIONS);

  const hasPermission = (permissionId: string): boolean => {
    if (!currentUser) return false;
    const userGroup = groups.find(g => g.id === currentUser.groupId);
    return userGroup?.permissions.includes(permissionId) || false;
  };

  const hasAnyPermission = (permissionIds: string[]): boolean => {
    return permissionIds.some(permissionId => hasPermission(permissionId));
  };

  const getUserGroup = (groupId: string): UserGroup | undefined => {
    return groups.find(g => g.id === groupId);
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = {
      ...user,
      id: Math.max(...users.map(u => u.id)) + 1,
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: number, userUpdate: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...userUpdate } : user
    ));
  };

  const deleteUser = (id: number) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const addGroup = (group: Omit<UserGroup, 'id'>) => {
    const newGroup = {
      ...group,
      id: group.name.toLowerCase().replace(/\s+/g, '_'),
    };
    setGroups(prev => [...prev, newGroup]);
  };

  const updateGroup = (id: string, groupUpdate: Partial<UserGroup>) => {
    setGroups(prev => prev.map(group => 
      group.id === id ? { ...group, ...groupUpdate } : group
    ));
  };

  const deleteGroup = (id: string) => {
    setGroups(prev => prev.filter(group => group.id !== id));
  };

  return (
    <RBACContext.Provider value={{
      currentUser,
      users,
      groups,
      permissions,
      hasPermission,
      hasAnyPermission,
      getUserGroup,
      addUser,
      updateUser,
      deleteUser,
      addGroup,
      updateGroup,
      deleteGroup,
      setCurrentUser,
    }}>
      {children}
    </RBACContext.Provider>
  );
};

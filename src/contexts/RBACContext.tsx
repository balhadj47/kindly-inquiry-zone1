import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, UserGroup as Group, Permission, DEFAULT_PERMISSIONS, UserRole, UserStatus } from '@/types/rbac';

interface RBACContextType {
  currentUser: User | null;
  users: User[];
  groups: Group[];
  permissions: Permission[];
  loading: boolean;
  hasPermission: (permission: string) => boolean;
  setUser: (user: User | null) => void;
  addUser: (userData: Partial<User>) => Promise<void>;
  updateUser: (id: number, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  getUserGroup: (user: User) => Group | undefined;
  addGroup: (groupData: Partial<Group>) => Promise<void>;
  updateGroup: (id: string, groupData: Partial<Group>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

// Temporary development user for testing menu visibility
const DEV_USER: User = {
  id: 1,
  name: 'Development User',
  email: 'dev@example.com',
  phone: '+33123456789',
  groupId: 'admin',
  role: 'Administrator',
  status: 'Active',
  createdAt: new Date().toISOString(),
};

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRBACData = async () => {
      try {
        // Load default groups and permissions first
        const { DEFAULT_GROUPS, DEFAULT_PERMISSIONS } = await import('@/types/rbac');
        setGroups(DEFAULT_GROUPS);
        setPermissions(DEFAULT_PERMISSIONS);
        console.log('Default groups and permissions loaded:', DEFAULT_GROUPS);

        // Load users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*');

        if (usersError) {
          console.error('Error fetching users:', usersError);
        }

        console.log('Raw user data from DB:', usersData || []);

        const formattedUsers: User[] = (usersData || []).map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          groupId: user.group_id,
          role: user.role as UserRole,
          status: user.status as UserStatus,
          createdAt: user.created_at,
          licenseNumber: user.license_number,
          totalTrips: user.total_trips,
          lastTrip: user.last_trip,
        }));

        console.log('Formatted users from DB:', formattedUsers);
        setUsers(formattedUsers);

        // Load groups from database (override defaults if they exist)
        const { data: groupsData, error: groupsError } = await supabase
          .from('user_groups')
          .select('*');

        if (groupsError) {
          console.error('Error fetching groups:', groupsError);
        } else if (groupsData && groupsData.length > 0) {
          console.log('Raw group data from DB:', groupsData);

          const formattedGroups = groupsData.map(group => ({
            id: group.id,
            name: group.name,
            description: group.description,
            permissions: Array.isArray(group.permissions) ? group.permissions : [],
            color: group.color || 'bg-gray-100 text-gray-800',
          }));

          console.log('Formatted groups from DB (overriding defaults):', formattedGroups);
          setGroups(formattedGroups);
        }

        // For development: if no users exist in DB, use dev user
        if (formattedUsers.length === 0) {
          console.log('No users found in database, using development user');
          setCurrentUser(DEV_USER);
        } else {
          // In a real app, you'd get the current user from auth
          // For now, just use the first user or dev user
          setCurrentUser(formattedUsers[0] || DEV_USER);
        }

        console.log('RBAC data loaded successfully');
      } catch (error) {
        console.error('Error loading RBAC data:', error);
        // Fallback to dev user and default groups if there's an error
        setCurrentUser(DEV_USER);
        
        try {
          const { DEFAULT_GROUPS, DEFAULT_PERMISSIONS } = await import('@/types/rbac');
          console.log('Loading default groups as fallback:', DEFAULT_GROUPS);
          setGroups(DEFAULT_GROUPS);
          setPermissions(DEFAULT_PERMISSIONS);
        } catch (importError) {
          console.error('Error importing default groups:', importError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadRBACData();
  }, []);

  const hasPermission = (permission: string): boolean => {
    console.log(`Checking permission: ${permission}`);
    console.log('Current user:', currentUser);
    
    if (!currentUser) {
      console.log('No current user, permission denied');
      return false;
    }

    const userGroup = groups.find(g => g.id === currentUser.groupId);
    console.log('User group:', userGroup);
    console.log('Available groups:', groups);
    
    if (!userGroup) {
      console.log('No group found for user, permission denied');
      return false;
    }

    const hasPermission = userGroup.permissions.includes(permission);
    console.log(`Permission ${permission} result:`, hasPermission);
    console.log('User group permissions:', userGroup.permissions);
    
    return hasPermission;
  };

  const setUser = (user: User | null) => {
    setCurrentUser(user);
  };

  const addUser = async (userData: Partial<User>) => {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        group_id: userData.groupId,
        role: userData.role,
        status: userData.status,
        license_number: userData.licenseNumber,
      }])
      .select();

    if (error) {
      console.error('Error adding user:', error);
      throw error;
    }

    if (data && data[0]) {
      const newUser: User = {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email,
        phone: data[0].phone,
        groupId: data[0].group_id,
        role: data[0].role as UserRole,
        status: data[0].status as UserStatus,
        createdAt: data[0].created_at,
        licenseNumber: data[0].license_number,
        totalTrips: data[0].total_trips,
        lastTrip: data[0].last_trip,
      };
      setUsers(prev => [...prev, newUser]);
    }
  };

  const updateUser = async (id: number, userData: Partial<User>) => {
    const { data, error } = await supabase
      .from('users')
      .update({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        group_id: userData.groupId,
        role: userData.role,
        status: userData.status,
        license_number: userData.licenseNumber,
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }

    if (data && data[0]) {
      const updatedUser: User = {
        id: data[0].id,
        name: data[0].name,
        email: data[0].email,
        phone: data[0].phone,
        groupId: data[0].group_id,
        role: data[0].role as UserRole,
        status: data[0].status as UserStatus,
        createdAt: data[0].created_at,
        licenseNumber: data[0].license_number,
        totalTrips: data[0].total_trips,
        lastTrip: data[0].last_trip,
      };
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
    }
  };

  const deleteUser = async (id: number) => {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      throw error;
    }

    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const getUserGroup = (user: User): Group | undefined => {
    return groups.find(g => g.id === user.groupId);
  };

  const addGroup = async (groupData: Partial<Group>) => {
    const { data, error } = await supabase
      .from('user_groups')
      .insert([{
        id: groupData.id,
        name: groupData.name,
        description: groupData.description,
        permissions: groupData.permissions,
        color: groupData.color,
      }])
      .select();

    if (error) {
      console.error('Error adding group:', error);
      throw error;
    }

    if (data && data[0]) {
      const newGroup = {
        id: data[0].id,
        name: data[0].name,
        description: data[0].description,
        permissions: data[0].permissions || [],
        color: data[0].color,
      };
      setGroups(prev => [...prev, newGroup]);
    }
  };

  const updateGroup = async (id: string, groupData: Partial<Group>) => {
    const { data, error } = await supabase
      .from('user_groups')
      .update({
        name: groupData.name,
        description: groupData.description,
        permissions: groupData.permissions,
        color: groupData.color,
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating group:', error);
      throw error;
    }

    if (data && data[0]) {
      const updatedGroup = {
        id: data[0].id,
        name: data[0].name,
        description: data[0].description,
        permissions: data[0].permissions || [],
        color: data[0].color,
      };
      setGroups(prev => prev.map(group => group.id === id ? updatedGroup : group));
    }
  };

  const deleteGroup = async (id: string) => {
    const { error } = await supabase
      .from('user_groups')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting group:', error);
      throw error;
    }

    setGroups(prev => prev.filter(group => group.id !== id));
  };

  return (
    <RBACContext.Provider value={{
      currentUser,
      users,
      groups,
      permissions,
      loading,
      hasPermission,
      setUser,
      addUser,
      updateUser,
      deleteUser,
      getUserGroup,
      addGroup,
      updateGroup,
      deleteGroup,
    }}>
      {children}
    </RBACContext.Provider>
  );
};

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};

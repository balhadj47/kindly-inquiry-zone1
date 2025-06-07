
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserGroup, Permission, DEFAULT_PERMISSIONS, DEFAULT_GROUPS } from '@/types/rbac';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RBACContextType {
  currentUser: User | null;
  users: User[];
  groups: UserGroup[];
  permissions: Permission[];
  loading: boolean;
  hasPermission: (permissionId: string) => boolean;
  hasAnyPermission: (permissionIds: string[]) => boolean;
  getUserGroup: (groupId: string) => UserGroup | undefined;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: number, user: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  addGroup: (group: Omit<UserGroup, 'id'>) => Promise<void>;
  updateGroup: (id: string, group: Partial<UserGroup>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  setCurrentUser: (user: User | null) => void;
  refreshData: () => Promise<void>;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [permissions] = useState<Permission[]>(DEFAULT_PERMISSIONS);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      console.log('Loading initial RBAC data...');
      
      await Promise.all([
        fetchUsers(),
        fetchGroups()
      ]);
      
      console.log('RBAC data loaded successfully');
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast({
        title: "Error",
        description: "Failed to load data from database",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const { data, error } = await (supabase as any)
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      console.log('Raw user data from DB:', data);

      const formattedUsers: User[] = (data || []).map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role as User['role'],
        groupId: user.group_id,
        status: user.status as User['status'],
        licenseNumber: user.license_number || undefined,
        totalTrips: user.total_trips || undefined,
        lastTrip: user.last_trip || undefined,
        createdAt: user.created_at,
      }));

      console.log('Formatted users:', formattedUsers);
      setUsers(formattedUsers);

      // Set the demo admin user as current user if available
      const adminUser = formattedUsers.find(user => user.email === 'admin@company.com');
      if (adminUser && !currentUser) {
        console.log('Setting admin user as current user:', adminUser);
        setCurrentUser(adminUser);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchGroups = async () => {
    try {
      console.log('Fetching groups...');
      const { data, error } = await (supabase as any)
        .from('user_groups')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching groups:', error);
        return;
      }

      console.log('Raw group data from DB:', data);

      const formattedGroups: UserGroup[] = (data || []).map((group: any) => ({
        id: group.id,
        name: group.name,
        description: group.description,
        permissions: group.permissions || [],
        color: group.color,
      }));

      console.log('Formatted groups:', formattedGroups);
      setGroups(formattedGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const refreshData = async () => {
    await Promise.all([fetchUsers(), fetchGroups()]);
  };

  const hasPermission = (permissionId: string): boolean => {
    console.log('Checking permission:', permissionId);
    console.log('Current user:', currentUser);
    
    if (!currentUser) {
      console.log('No current user, permission denied');
      return false;
    }
    
    const userGroup = groups.find(g => g.id === currentUser.groupId);
    console.log('User group:', userGroup);
    
    if (!userGroup) {
      console.log('No user group found, permission denied');
      return false;
    }
    
    const hasPermission = userGroup.permissions.includes(permissionId);
    console.log(`Permission ${permissionId}: ${hasPermission}`);
    
    return hasPermission;
  };

  const hasAnyPermission = (permissionIds: string[]): boolean => {
    return permissionIds.some(permissionId => hasPermission(permissionId));
  };

  const getUserGroup = (groupId: string): UserGroup | undefined => {
    return groups.find(g => g.id === groupId);
  };

  const addUser = async (user: Omit<User, 'id'>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('users')
        .insert({
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          group_id: user.groupId,
          status: user.status,
          license_number: user.licenseNumber,
          created_at: user.createdAt,
        } as any)
        .select()
        .single();

      if (error) throw error;

      await fetchUsers();
      
      toast({
        title: "Success",
        description: "User created successfully",
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const updateUser = async (id: number, userUpdate: Partial<User>) => {
    try {
      const { error } = await (supabase as any)
        .from('users')
        .update({
          name: userUpdate.name,
          email: userUpdate.email,
          phone: userUpdate.phone,
          role: userUpdate.role,
          group_id: userUpdate.groupId,
          status: userUpdate.status,
          license_number: userUpdate.licenseNumber,
        } as any)
        .eq('id', id);

      if (error) throw error;

      await fetchUsers();
      
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const { error } = await (supabase as any)
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchUsers();
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const addGroup = async (group: Omit<UserGroup, 'id'>) => {
    try {
      const { error } = await (supabase as any)
        .from('user_groups')
        .insert({
          id: group.name.toLowerCase().replace(/\s+/g, '_'),
          name: group.name,
          description: group.description,
          permissions: group.permissions || [],
          color: group.color,
        } as any);

      if (error) throw error;

      await fetchGroups();
      
      toast({
        title: "Success",
        description: "Group created successfully",
      });
    } catch (error) {
      console.error('Error adding group:', error);
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive",
      });
    }
  };

  const updateGroup = async (id: string, groupUpdate: Partial<UserGroup>) => {
    try {
      const { error } = await (supabase as any)
        .from('user_groups')
        .update({
          name: groupUpdate.name,
          description: groupUpdate.description,
          permissions: groupUpdate.permissions,
          color: groupUpdate.color,
        } as any)
        .eq('id', id);

      if (error) throw error;

      await fetchGroups();
      
      toast({
        title: "Success",
        description: "Group updated successfully",
      });
    } catch (error) {
      console.error('Error updating group:', error);
      toast({
        title: "Error",
        description: "Failed to update group",
        variant: "destructive",
      });
    }
  };

  const deleteGroup = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('user_groups')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchGroups();
      
      toast({
        title: "Success",
        description: "Group deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting group:', error);
      toast({
        title: "Error",
        description: "Failed to delete group",
        variant: "destructive",
      });
    }
  };

  return (
    <RBACContext.Provider value={{
      currentUser,
      users,
      groups,
      permissions,
      loading,
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
      refreshData,
    }}>
      {children}
    </RBACContext.Provider>
  );
};

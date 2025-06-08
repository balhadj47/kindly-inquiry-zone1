
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
      console.log('Loading RBAC data from database...');
      
      // Fetch data from database
      const [dbUsers, dbGroups] = await Promise.all([
        fetchUsersFromDB(),
        fetchGroupsFromDB()
      ]);
      
      // If no groups exist, create default groups
      if (dbGroups.length === 0) {
        console.log('No groups found, creating default groups...');
        await createDefaultGroups();
        const newGroups = await fetchGroupsFromDB();
        setGroups(newGroups);
      } else {
        setGroups(dbGroups);
      }
      
      setUsers(dbUsers);
      
      // Set the first admin user as current user if exists
      const adminUser = dbUsers.find(user => user.role === 'Administrator') || dbUsers[0];
      if (adminUser) {
        setCurrentUser(adminUser);
      }
      
      console.log('RBAC data loaded successfully');
    } catch (error) {
      console.error('Error loading RBAC data:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des données",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultGroups = async () => {
    try {
      const { error } = await (supabase as any)
        .from('user_groups')
        .insert(DEFAULT_GROUPS);

      if (error) {
        console.error('Error creating default groups:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error creating default groups:', error);
    }
  };

  const fetchUsersFromDB = async (): Promise<User[]> => {
    try {
      console.log('Fetching users from database...');
      const { data, error } = await (supabase as any)
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users from DB:', error);
        return [];
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

      console.log('Formatted users from DB:', formattedUsers);
      return formattedUsers;
    } catch (error) {
      console.error('Error fetching users from DB:', error);
      return [];
    }
  };

  const fetchGroupsFromDB = async (): Promise<UserGroup[]> => {
    try {
      console.log('Fetching groups from database...');
      const { data, error } = await (supabase as any)
        .from('user_groups')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching groups from DB:', error);
        return [];
      }

      console.log('Raw group data from DB:', data);

      const formattedGroups: UserGroup[] = (data || []).map((group: any) => ({
        id: group.id,
        name: group.name,
        description: group.description,
        permissions: group.permissions || [],
        color: group.color,
      }));

      console.log('Formatted groups from DB:', formattedGroups);
      return formattedGroups;
    } catch (error) {
      console.error('Error fetching groups from DB:', error);
      return [];
    }
  };

  const refreshData = async () => {
    await loadInitialData();
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

      await refreshData();
      
      toast({
        title: "Succès",
        description: "Utilisateur créé avec succès",
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Erreur",
        description: "Échec de la création de l'utilisateur",
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

      await refreshData();
      
      toast({
        title: "Succès",
        description: "Utilisateur mis à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Erreur",
        description: "Échec de la mise à jour de l'utilisateur",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const userToDelete = users.find(user => user.id === id);
      if (!userToDelete) {
        toast({
          title: "Erreur",
          description: "Utilisateur non trouvé",
          variant: "destructive",
        });
        return;
      }

      // Prevent deletion of current user
      if (currentUser && currentUser.id === id) {
        toast({
          title: "Erreur",
          description: "Vous ne pouvez pas supprimer votre propre compte",
          variant: "destructive",
        });
        return;
      }

      const { error } = await (supabase as any)
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await refreshData();
      
      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erreur",
        description: "Échec de la suppression de l'utilisateur",
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

      await refreshData();
      
      toast({
        title: "Succès",
        description: "Groupe créé avec succès",
      });
    } catch (error) {
      console.error('Error adding group:', error);
      toast({
        title: "Erreur",
        description: "Échec de la création du groupe",
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

      await refreshData();
      
      toast({
        title: "Succès",
        description: "Groupe mis à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating group:', error);
      toast({
        title: "Erreur",
        description: "Échec de la mise à jour du groupe",
        variant: "destructive",
      });
    }
  };

  const deleteGroup = async (id: string) => {
    try {
      // Check if any users are assigned to this group
      const usersInGroup = users.filter(user => user.groupId === id);
      
      if (usersInGroup.length > 0) {
        toast({
          title: "Erreur",
          description: `Impossible de supprimer le groupe. ${usersInGroup.length} utilisateur(s) y sont assignés. Veuillez d'abord réassigner ces utilisateurs à un autre groupe.`,
          variant: "destructive",
        });
        return;
      }

      const { error } = await (supabase as any)
        .from('user_groups')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await refreshData();
      
      toast({
        title: "Succès",
        description: "Groupe supprimé avec succès",
      });
    } catch (error) {
      console.error('Error deleting group:', error);
      toast({
        title: "Erreur",
        description: "Échec de la suppression du groupe",
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

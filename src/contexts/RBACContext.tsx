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

// Demo data for fallback
const DEMO_ADMIN_USER: User = {
  id: 1,
  name: 'Admin User',
  email: 'admin@company.com',
  phone: '+1234567890',
  role: 'Administrator',
  groupId: 'admin',
  status: 'Active',
  createdAt: new Date().toISOString(),
};

// Arabic sample users for each group
const SAMPLE_ARABIC_USERS: User[] = [
  // Administrators
  {
    id: 2,
    name: 'أحمد محمد العلي',
    email: 'ahmed.ali@company.com',
    phone: '+966501234567',
    role: 'Administrator',
    groupId: 'admin',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'فاطمة سالم النور',
    email: 'fatima.nour@company.com',
    phone: '+966507654321',
    role: 'Administrator',
    groupId: 'admin',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
  // Employees
  {
    id: 4,
    name: 'خالد عبد الرحمن',
    email: 'khalid.abdulrahman@company.com',
    phone: '+966502345678',
    role: 'Employee',
    groupId: 'employee',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'نورا أحمد الزهراني',
    email: 'nora.zahrani@company.com',
    phone: '+966508765432',
    role: 'Employee',
    groupId: 'employee',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
  // Chef de Groupe Armé
  {
    id: 6,
    name: 'عبد الله محمد الحربي',
    email: 'abdullah.harbi@company.com',
    phone: '+966503456789',
    role: 'Chef de Groupe Armé',
    groupId: 'chef_groupe_arme',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 7,
    name: 'سارة يوسف القحطاني',
    email: 'sara.qahtani@company.com',
    phone: '+966509876543',
    role: 'Chef de Groupe Armé',
    groupId: 'chef_groupe_arme',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
  // Chef de Groupe Sans Armé
  {
    id: 8,
    name: 'محمد علي السلمي',
    email: 'mohammed.selmi@company.com',
    phone: '+966504567890',
    role: 'Chef de Groupe Sans Armé',
    groupId: 'chef_groupe_sans_arme',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 9,
    name: 'آمنة حسن الشهري',
    email: 'amna.shahri@company.com',
    phone: '+966500987654',
    role: 'Chef de Groupe Sans Armé',
    groupId: 'chef_groupe_sans_arme',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
  // Chauffeur Armé
  {
    id: 10,
    name: 'عمر سعد الغامدي',
    email: 'omar.ghamdi@company.com',
    phone: '+966505678901',
    role: 'Chauffeur Armé',
    groupId: 'chauffeur_arme',
    status: 'Active',
    licenseNumber: 'DL-AR-001234',
    totalTrips: 45,
    lastTrip: '2024-01-15',
    createdAt: new Date().toISOString(),
  },
  {
    id: 11,
    name: 'ليلى عبد العزيز',
    email: 'layla.abdulaziz@company.com',
    phone: '+966501098765',
    role: 'Chauffeur Armé',
    groupId: 'chauffeur_arme',
    status: 'Active',
    licenseNumber: 'DL-AR-005678',
    totalTrips: 38,
    lastTrip: '2024-01-18',
    createdAt: new Date().toISOString(),
  },
  // Chauffeur Sans Armé
  {
    id: 12,
    name: 'يوسف إبراهيم العتيبي',
    email: 'youssef.otaibi@company.com',
    phone: '+966506789012',
    role: 'Chauffeur Sans Armé',
    groupId: 'chauffeur_sans_arme',
    status: 'Active',
    licenseNumber: 'DL-SA-009876',
    totalTrips: 52,
    lastTrip: '2024-01-20',
    createdAt: new Date().toISOString(),
  },
  {
    id: 13,
    name: 'هدى محمد البقمي',
    email: 'huda.bogmi@company.com',
    phone: '+966502109876',
    role: 'Chauffeur Sans Armé',
    groupId: 'chauffeur_sans_arme',
    status: 'Active',
    licenseNumber: 'DL-SA-543210',
    totalTrips: 29,
    lastTrip: '2024-01-17',
    createdAt: new Date().toISOString(),
  },
  // APS Armé
  {
    id: 14,
    name: 'سلمان راشد الدوسري',
    email: 'salman.dosari@company.com',
    phone: '+966507890123',
    role: 'APS Armé',
    groupId: 'aps_arme',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 15,
    name: 'ريم سليمان المطيري',
    email: 'reem.mutairi@company.com',
    phone: '+966503210987',
    role: 'APS Armé',
    groupId: 'aps_arme',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
  // APS Sans Armé
  {
    id: 16,
    name: 'حسام عبد الله الجهني',
    email: 'hussam.johani@company.com',
    phone: '+966508901234',
    role: 'APS Sans Armé',
    groupId: 'aps_sans_arme',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 17,
    name: 'منى أحمد الشمري',
    email: 'mona.shamri@company.com',
    phone: '+966504321098',
    role: 'APS Sans Armé',
    groupId: 'aps_sans_arme',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
];

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
      
      // Try to fetch from database first
      const [dbUsers, dbGroups] = await Promise.all([
        fetchUsersFromDB(),
        fetchGroupsFromDB()
      ]);
      
      // If database is empty or has issues, use demo data with Arabic users
      if (dbUsers.length === 0 || dbGroups.length === 0) {
        console.log('Database is empty or has issues, using demo data with Arabic users...');
        const allDemoUsers = [DEMO_ADMIN_USER, ...SAMPLE_ARABIC_USERS];
        setUsers(allDemoUsers);
        setGroups(DEFAULT_GROUPS);
        setCurrentUser(DEMO_ADMIN_USER);
      } else {
        setUsers(dbUsers);
        setGroups(dbGroups);
        // Set the first admin user as current user
        const adminUser = dbUsers.find(user => user.role === 'Administrator') || dbUsers[0];
        if (adminUser) {
          setCurrentUser(adminUser);
        }
      }
      
      console.log('RBAC data loaded successfully');
    } catch (error) {
      console.error('Error loading initial data, using demo data:', error);
      // Fallback to demo data on any error
      const allDemoUsers = [DEMO_ADMIN_USER, ...SAMPLE_ARABIC_USERS];
      setUsers(allDemoUsers);
      setGroups(DEFAULT_GROUPS);
      setCurrentUser(DEMO_ADMIN_USER);
    } finally {
      setLoading(false);
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

  const fetchUsers = async () => {
    const dbUsers = await fetchUsersFromDB();
    setUsers(dbUsers);
  };

  const fetchGroups = async () => {
    const dbGroups = await fetchGroupsFromDB();
    setGroups(dbGroups);
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

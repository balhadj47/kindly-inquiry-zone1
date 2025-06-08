
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Group } from '@/types/rbac';

interface RBACContextType {
  currentUser: User | null;
  groups: Group[];
  loading: boolean;
  hasPermission: (permission: string) => boolean;
  setUser: (user: User | null) => void;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

// Temporary development user for testing menu visibility
const DEV_USER: User = {
  id: 'dev-user-1',
  name: 'Development User',
  email: 'dev@example.com',
  groupId: 'admin',
  role: 'admin',
  isActive: true,
  createdAt: new Date().toISOString(),
};

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRBACData = async () => {
      try {
        // Load users
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*');

        if (usersError) {
          console.error('Error fetching users:', usersError);
        }

        console.log('Raw user data from DB:', usersData || []);

        const formattedUsers = (usersData || []).map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          groupId: user.group_id,
          role: user.role || 'employee',
          isActive: user.is_active !== false,
          createdAt: user.created_at,
        }));

        console.log('Formatted users from DB:', formattedUsers);

        // Load groups
        const { data: groupsData, error: groupsError } = await supabase
          .from('groups')
          .select('*');

        if (groupsError) {
          console.error('Error fetching groups:', groupsError);
        }

        console.log('Raw group data from DB:', groupsData || []);

        const formattedGroups = (groupsData || []).map(group => ({
          id: group.id,
          name: group.name,
          description: group.description,
          permissions: Array.isArray(group.permissions) ? group.permissions : [],
          color: group.color || 'bg-gray-100 text-gray-800',
        }));

        console.log('Formatted groups from DB:', formattedGroups);

        setGroups(formattedGroups);

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
        // Fallback to dev user if there's an error
        setCurrentUser(DEV_USER);
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
    
    if (!userGroup) {
      console.log('No group found for user, permission denied');
      return false;
    }

    const hasPermission = userGroup.permissions.includes(permission);
    console.log(`Permission ${permission} result:`, hasPermission);
    
    return hasPermission;
  };

  const setUser = (user: User | null) => {
    setCurrentUser(user);
  };

  return (
    <RBACContext.Provider value={{
      currentUser,
      groups,
      loading,
      hasPermission,
      setUser,
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

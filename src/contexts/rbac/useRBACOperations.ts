
import type { User, UserGroup } from '@/types/rbac';
import { createPermissionUtils } from './permissionUtils';

interface UseRBACOperationsProps {
  currentUser: User | null;
  groups: UserGroup[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setGroups: React.Dispatch<React.SetStateAction<UserGroup[]>>;
}

export const useRBACOperations = ({
  currentUser,
  groups,
  setUsers,
  setGroups,
}: UseRBACOperationsProps) => {
  const permissionUtils = createPermissionUtils(currentUser, groups);

  // User operations with string IDs
  const addUser = async (userData: any): Promise<void> => {
    console.log('Adding user:', userData);
    // Mock implementation for now
    const newUser: User = {
      id: Date.now().toString(), // Generate string ID
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      role: userData.role,
      groupId: userData.groupId,
      status: userData.status || 'Active',
      createdAt: new Date().toISOString(),
    };
    
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = async (userId: string, userData: any): Promise<void> => {
    console.log('Updating user:', userId, userData);
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    ));
  };

  const deleteUser = async (userId: string): Promise<void> => {
    console.log('Deleting user:', userId);
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const changeUserPassword = async (email: string, newPassword: string): Promise<void> => {
    console.log('Changing password for:', email);
    // Mock implementation
  };

  // Group operations
  const addGroup = async (groupData: any): Promise<void> => {
    console.log('Adding group:', groupData);
    const newGroup: UserGroup = {
      id: Date.now().toString(),
      name: groupData.name,
      description: groupData.description,
      color: groupData.color,
      permissions: groupData.permissions || [],
    };
    
    setGroups(prev => [...prev, newGroup]);
  };

  const updateGroup = async (groupId: string, groupData: any): Promise<void> => {
    console.log('Updating group:', groupId, groupData);
    setGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, ...groupData } : group
    ));
  };

  const deleteGroup = async (groupId: string): Promise<void> => {
    console.log('Deleting group:', groupId);
    setGroups(prev => prev.filter(group => group.id !== groupId));
  };

  return {
    addUser,
    updateUser,
    deleteUser,
    changeUserPassword,
    addGroup,
    updateGroup,
    deleteGroup,
    ...permissionUtils,
  };
};

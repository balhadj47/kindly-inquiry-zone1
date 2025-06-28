
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Search } from 'lucide-react';
import { useUserFiltering } from '@/hooks/useUserFiltering';
import { useRoleData } from '@/hooks/useRoleData';
import type { User } from '@/types/rbac';

interface UserSelectionSectionProps {
  userSearchQuery: string;
  setUserSearchQuery: (query: string) => void;
  selectedUserIds: string[];
  onUserSelection: (userId: string, checked: boolean) => void;
}

const UserRoleDisplay: React.FC<{ roleId: number }> = ({ roleId }) => {
  const { roleName } = useRoleData(roleId);
  return <span>{roleName}</span>;
};

const UserSelectionSection: React.FC<UserSelectionSectionProps> = ({
  userSearchQuery,
  setUserSearchQuery,
  selectedUserIds,
  onUserSelection,
}) => {
  const { filteredUsers, totalFilteredUsers, users } = useUserFiltering(userSearchQuery);

  console.log('👥 UserSelectionSection: Rendering with data:', {
    filteredUsersCount: Array.isArray(filteredUsers) ? filteredUsers.length : 0,
    totalUsers: Array.isArray(users) ? users.length : 0,
    selectedCount: Array.isArray(selectedUserIds) ? selectedUserIds.length : 0
  });

  // Group users by their role_id with comprehensive error handling
  const usersByRole = React.useMemo((): [string, User[]][] => {
    try {
      if (!Array.isArray(filteredUsers)) {
        console.warn('👥 UserSelectionSection: filteredUsers is not an array:', typeof filteredUsers);
        return [];
      }

      const grouped: Record<string, User[]> = filteredUsers.reduce((acc, user) => {
        if (!user || typeof user !== 'object') {
          console.warn('👥 UserSelectionSection: Invalid user object:', user);
          return acc;
        }

        try {
          const roleKey = `Role ${user.role_id}`;
          if (!acc[roleKey]) {
            acc[roleKey] = [];
          }
          acc[roleKey].push(user);
        } catch (error) {
          console.error('👥 UserSelectionSection: Error grouping user:', user.id, error);
        }
        return acc;
      }, {} as Record<string, User[]>);
      
      const result = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
      console.log('👥 UserSelectionSection: Grouped users by role:', result.length, 'roles');
      return result;
    } catch (error) {
      console.error('👥 UserSelectionSection: Error grouping users by role:', error);
      return [];
    }
  }, [filteredUsers]);

  // Safe handler functions
  const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target.value || '';
      setUserSearchQuery(value);
    } catch (error) {
      console.error('👥 UserSelectionSection: Error handling search change:', error);
    }
  }, [setUserSearchQuery]);

  const handleUserSelection = React.useCallback((userId: string, checked: boolean) => {
    try {
      if (!userId || typeof userId !== 'string') {
        console.warn('👥 UserSelectionSection: Invalid userId for selection:', userId);
        return;
      }
      onUserSelection(userId, checked);
    } catch (error) {
      console.error('👥 UserSelectionSection: Error handling user selection:', error);
    }
  }, [onUserSelection]);

  const safeSelectedUserIds = Array.isArray(selectedUserIds) ? selectedUserIds : [];
  const safeUserSearchQuery = typeof userSearchQuery === 'string' ? userSearchQuery : '';

  return (
    <div className="space-y-4">
      <Label className="flex items-center space-x-2">
        <Users className="h-4 w-4" />
        <span>Select Users ({safeSelectedUserIds.length} selected)</span>
      </Label>
      
      {/* User Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users by name..."
          value={safeUserSearchQuery}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      {/* Users grouped by their roles */}
      <div className="max-h-96 overflow-y-auto border rounded-md">
        {!Array.isArray(usersByRole) || usersByRole.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            {safeUserSearchQuery ? 'No users found matching your search.' : 'No users available.'}
          </p>
        ) : (
          usersByRole.map(([roleName, roleUsers]) => {
            if (!Array.isArray(roleUsers) || roleUsers.length === 0) {
              return null;
            }

            return (
              <div key={roleName} className="border-b last:border-b-0">
                <div className="px-4 py-3 bg-gray-100 font-medium text-sm border-b">
                  {roleName || 'Unknown Role'} ({roleUsers.length} users)
                </div>
                <div className="p-3 space-y-3">
                  {roleUsers.map((user) => {
                    if (!user || !user.id) {
                      console.warn('👥 UserSelectionSection: Invalid user in role group:', user);
                      return null;
                    }

                    const isActive = user.status === 'Active';
                    const isDisabled = !isActive;
                    const userId = String(user.id);
                    const isSelected = safeSelectedUserIds.includes(userId);
                    
                    return (
                      <div key={user.id} className={`flex items-center space-x-3 ${isDisabled ? 'opacity-50' : ''}`}>
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => handleUserSelection(userId, Boolean(checked))}
                          disabled={isDisabled}
                        />
                        <label 
                          htmlFor={`user-${user.id}`} 
                          className={`flex-1 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{user.name || 'Unknown User'}</span>
                              <span className="text-sm text-gray-500 ml-2">
                                (<UserRoleDisplay roleId={user.role_id} />)
                              </span>
                              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                user.status === 'Active' ? 'bg-green-100 text-green-800' :
                                user.status === 'Récupération' ? 'bg-yellow-100 text-yellow-800' :
                                user.status === 'Congé' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {user.status || 'Unknown'}
                              </span>
                            </div>
                            {user.licenseNumber && (
                              <span className="text-xs text-gray-400">{user.licenseNumber}</span>
                            )}
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {safeUserSearchQuery && (
        <p className="text-xs text-gray-500">
          Showing {totalFilteredUsers || 0} of {Array.isArray(users) ? users.length : 0} users
        </p>
      )}
      
      {safeSelectedUserIds.length === 0 && (
        <p className="text-sm text-gray-500">Please select at least one user for the trip.</p>
      )}
    </div>
  );
};

export default UserSelectionSection;

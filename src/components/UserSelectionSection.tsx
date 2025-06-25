
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Search } from 'lucide-react';
import { useUserFiltering } from '@/hooks/useUserFiltering';
import { getRoleNameFromId } from '@/utils/roleUtils';
import type { User } from '@/types/rbac';

interface UserSelectionSectionProps {
  userSearchQuery: string;
  setUserSearchQuery: (query: string) => void;
  selectedUserIds: string[];
  onUserSelection: (userId: string, checked: boolean) => void;
}

const UserSelectionSection: React.FC<UserSelectionSectionProps> = ({
  userSearchQuery,
  setUserSearchQuery,
  selectedUserIds,
  onUserSelection,
}) => {
  const { filteredUsers, totalFilteredUsers, users } = useUserFiltering(userSearchQuery);

  console.log('👥 UserSelectionSection: Rendering with data:', {
    filteredUsersCount: filteredUsers?.length || 0,
    totalUsers: users?.length || 0,
    selectedCount: selectedUserIds?.length || 0
  });

  // Group users by their role_id with proper typing and error handling
  const usersByRole = React.useMemo(() => {
    try {
      if (!filteredUsers || !Array.isArray(filteredUsers)) {
        console.warn('👥 UserSelectionSection: Invalid filtered users data');
        return [] as [string, User[]][];
      }

      const grouped: Record<string, User[]> = filteredUsers.reduce((acc, user) => {
        if (!user || typeof user !== 'object') {
          console.warn('👥 UserSelectionSection: Invalid user object:', user);
          return acc;
        }

        try {
          const roleName = getRoleNameFromId(user.role_id);
          if (!acc[roleName]) {
            acc[roleName] = [];
          }
          acc[roleName].push(user);
        } catch (error) {
          console.error('👥 UserSelectionSection: Error getting role name for user:', user.id, error);
        }
        return acc;
      }, {} as Record<string, User[]>);
      
      const result = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)) as [string, User[]][];
      console.log('👥 UserSelectionSection: Grouped users by role:', result.length, 'roles');
      return result;
    } catch (error) {
      console.error('👥 UserSelectionSection: Error grouping users by role:', error);
      return [] as [string, User[]][];
    }
  }, [filteredUsers]);

  return (
    <div className="space-y-4">
      <Label className="flex items-center space-x-2">
        <Users className="h-4 w-4" />
        <span>Select Users ({selectedUserIds?.length || 0} selected)</span>
      </Label>
      
      {/* User Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users by name..."
          value={userSearchQuery || ''}
          onChange={(e) => setUserSearchQuery(e.target.value || '')}
          className="pl-10"
        />
      </div>

      {/* Users grouped by their roles */}
      <div className="max-h-96 overflow-y-auto border rounded-md">
        {!usersByRole || usersByRole.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            {userSearchQuery ? 'No users found matching your search.' : 'No users available.'}
          </p>
        ) : (
          usersByRole.map(([roleName, roleUsers]) => {
            if (!roleUsers || !Array.isArray(roleUsers) || roleUsers.length === 0) {
              return null;
            }

            return (
              <div key={roleName} className="border-b last:border-b-0">
                <div className="px-4 py-3 bg-gray-100 font-medium text-sm border-b">
                  {roleName} ({roleUsers.length} users)
                </div>
                <div className="p-3 space-y-3">
                  {roleUsers.map((user) => {
                    if (!user || !user.id) {
                      console.warn('👥 UserSelectionSection: Invalid user in role group:', user);
                      return null;
                    }

                    const isActive = user.status === 'Active';
                    const isDisabled = !isActive;
                    const userId = user.id.toString();
                    const isSelected = selectedUserIds?.includes(userId) || false;
                    
                    return (
                      <div key={user.id} className={`flex items-center space-x-3 ${isDisabled ? 'opacity-50' : ''}`}>
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            try {
                              onUserSelection(userId, checked as boolean);
                            } catch (error) {
                              console.error('👥 UserSelectionSection: Error handling user selection:', error);
                            }
                          }}
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
                                ({getRoleNameFromId(user.role_id)})
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
      
      {userSearchQuery && (
        <p className="text-xs text-gray-500">
          Showing {totalFilteredUsers || 0} of {users?.length || 0} users
        </p>
      )}
      
      {(!selectedUserIds || selectedUserIds.length === 0) && (
        <p className="text-sm text-gray-500">Please select at least one user for the trip.</p>
      )}
    </div>
  );
};

export default UserSelectionSection;

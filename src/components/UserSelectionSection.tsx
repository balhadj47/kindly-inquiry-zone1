
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

  // Group users by their role_id with proper typing
  const usersByRole = React.useMemo(() => {
    const grouped: Record<string, User[]> = filteredUsers.reduce((acc, user) => {
      const roleName = getRoleNameFromId(user.role_id);
      if (!acc[roleName]) {
        acc[roleName] = [];
      }
      acc[roleName].push(user);
      return acc;
    }, {} as Record<string, User[]>);
    
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)) as [string, User[]][];
  }, [filteredUsers]);

  return (
    <div className="space-y-4">
      <Label className="flex items-center space-x-2">
        <Users className="h-4 w-4" />
        <span>Select Users ({selectedUserIds.length} selected)</span>
      </Label>
      
      {/* User Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users by name..."
          value={userSearchQuery}
          onChange={(e) => setUserSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users grouped by their roles */}
      <div className="max-h-96 overflow-y-auto border rounded-md">
        {usersByRole.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            {userSearchQuery ? 'No users found matching your search.' : 'No users available.'}
          </p>
        ) : (
          usersByRole.map(([roleName, roleUsers]) => {
            if (!roleUsers || roleUsers.length === 0) return null;

            return (
              <div key={roleName} className="border-b last:border-b-0">
                <div className="px-4 py-3 bg-gray-100 font-medium text-sm border-b">
                  {roleName} ({roleUsers.length} users)
                </div>
                <div className="p-3 space-y-3">
                  {roleUsers.map((user) => {
                    const isActive = user.status === 'Active';
                    const isDisabled = !isActive;
                    
                    return (
                      <div key={user.id} className={`flex items-center space-x-3 ${isDisabled ? 'opacity-50' : ''}`}>
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={selectedUserIds.includes(user.id.toString())}
                          onCheckedChange={(checked) => onUserSelection(user.id.toString(), checked as boolean)}
                          disabled={isDisabled}
                        />
                        <label 
                          htmlFor={`user-${user.id}`} 
                          className={`flex-1 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{user.name}</span>
                              <span className="text-sm text-gray-500 ml-2">({getRoleNameFromId(user.role_id)})</span>
                              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                user.status === 'Active' ? 'bg-green-100 text-green-800' :
                                user.status === 'Récupération' ? 'bg-yellow-100 text-yellow-800' :
                                user.status === 'Congé' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {user.status}
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
          Showing {totalFilteredUsers} of {users.length} users
        </p>
      )}
      
      {selectedUserIds.length === 0 && (
        <p className="text-sm text-gray-500">Please select at least one user for the trip.</p>
      )}
    </div>
  );
};

export default UserSelectionSection;

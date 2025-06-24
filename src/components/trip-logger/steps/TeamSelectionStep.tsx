
import React from 'react';
import { Users } from 'lucide-react';
import { UserWithRoles } from '@/hooks/useTripForm';
import { MissionRole } from '@/types/missionRoles';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';
import { Badge } from '@/components/ui/badge';

interface TeamSelectionStepProps {
  userSearchQuery: string;
  setUserSearchQuery: (query: string) => void;
  selectedUsersWithRoles: UserWithRoles[];
  onUserRoleSelection: (userId: string, roles: MissionRole[]) => void;
}

const TeamSelectionStep: React.FC<TeamSelectionStepProps> = ({
  userSearchQuery,
  setUserSearchQuery,
  selectedUsersWithRoles,
  onUserRoleSelection
}) => {
  const { users } = useRBAC();

  // Filter to show all users and apply search
  const filteredUsers = users.filter(user => {
    const matchesSearch = !userSearchQuery || 
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase());
    return matchesSearch;
  });

  // Sort users: active first, then by name
  const sortedUsers = filteredUsers.sort((a, b) => {
    if (a.status === 'Active' && b.status !== 'Active') return -1;
    if (a.status !== 'Active' && b.status === 'Active') return 1;
    return a.name.localeCompare(b.name);
  });

  const handleUserToggle = (userId: string, checked: boolean) => {
    if (checked) {
      // Add user with default role
      onUserRoleSelection(userId, []);
    } else {
      // Remove user
      onUserRoleSelection(userId, []);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
          <Users className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Sélection de l'équipe</h3>
        <p className="text-gray-600">Sélectionnez les utilisateurs pour cette mission</p>
      </div>

      {/* User Search */}
      <div className="space-y-4">
        <Label className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Utilisateurs ({selectedUsersWithRoles.length} sélectionnés)</span>
        </Label>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un utilisateur..."
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Users List */}
        <div className="max-h-96 overflow-y-auto border rounded-md">
          {sortedUsers.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              {userSearchQuery ? 'Aucun utilisateur trouvé.' : 'Aucun utilisateur disponible.'}
            </p>
          ) : (
            <div className="p-3 space-y-3">
              {sortedUsers.map((user) => {
                const isSelected = selectedUsersWithRoles.some(u => u.userId === user.id.toString());
                const isActive = user.status === 'Active';
                const isDisabled = !isActive;
                
                return (
                  <div key={user.id} className={`flex items-center space-x-3 ${isDisabled ? 'opacity-50' : ''}`}>
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => handleUserToggle(user.id.toString(), checked as boolean)}
                      disabled={isDisabled}
                    />
                    <label 
                      htmlFor={`user-${user.id}`} 
                      className={`flex-1 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{user.name}</span>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            user.status === 'Active' ? 'bg-green-100 text-green-800' :
                            user.status === 'Récupération' ? 'bg-yellow-100 text-yellow-800' :
                            user.status === 'Congé' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          {user.badgeNumber && (
                            <span>Badge: {user.badgeNumber}</span>
                          )}
                          <span>Role ID: {user.role_id}</span>
                        </div>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {userSearchQuery && (
          <p className="text-xs text-gray-500">
            {sortedUsers.length} utilisateur(s) trouvé(s)
          </p>
        )}
        
        {selectedUsersWithRoles.length === 0 && (
          <p className="text-sm text-gray-500">Veuillez sélectionner au moins un utilisateur pour la mission.</p>
        )}
      </div>
    </div>
  );
};

export default TeamSelectionStep;

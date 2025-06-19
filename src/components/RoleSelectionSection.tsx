import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Shield, Car, UserCheck, Target } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';
import { MissionRole } from '@/types/missionRoles';

interface UserWithRoles {
  userId: string;
  roles: MissionRole[];
}

interface RoleSelectionSectionProps {
  userSearchQuery: string;
  setUserSearchQuery: (query: string) => void;
  selectedUsersWithRoles: UserWithRoles[];
  onUserRoleSelection: (userId: string, roles: MissionRole[]) => void;
  filterByRoleId?: number;
}

const MISSION_ROLES: { value: MissionRole; label: string; icon: React.ComponentType<any>; color: string; selectedColor: string }[] = [
  { value: 'Chef de Groupe', label: 'Chef de Groupe', icon: Shield, color: 'bg-red-100 text-red-800', selectedColor: 'text-red-600' },
  { value: 'Chauffeur', label: 'Chauffeur', icon: Car, color: 'bg-blue-100 text-blue-800', selectedColor: 'text-blue-600' },
  { value: 'APS', label: 'APS', icon: UserCheck, color: 'bg-green-100 text-green-800', selectedColor: 'text-green-600' },
  { value: 'Armé', label: 'Armé', icon: Target, color: 'bg-orange-100 text-orange-800', selectedColor: 'text-orange-600' },
];

const RoleSelectionSection: React.FC<RoleSelectionSectionProps> = ({
  userSearchQuery,
  setUserSearchQuery,
  selectedUsersWithRoles,
  onUserRoleSelection,
  filterByRoleId,
}) => {
  const { users } = useRBAC();

  // Filter users based on search query and role_id
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(userSearchQuery.toLowerCase()));
    
    const matchesRole = !filterByRoleId || user.role_id === filterByRoleId;
    
    return matchesSearch && matchesRole;
  });

  // Only show active users
  const activeUsers = filteredUsers.filter(user => user.status === 'Active');

  const handleRoleToggle = (userId: string, role: MissionRole, checked: boolean) => {
    const currentUserRoles = selectedUsersWithRoles.find(u => u.userId === userId);
    let newRoles: MissionRole[] = [];

    if (currentUserRoles) {
      if (checked) {
        newRoles = [...currentUserRoles.roles, role];
      } else {
        newRoles = currentUserRoles.roles.filter(r => r !== role);
      }
    } else if (checked) {
      newRoles = [role];
    }

    onUserRoleSelection(userId, newRoles);
  };

  const getUserRoles = (userId: string): MissionRole[] => {
    return selectedUsersWithRoles.find(u => u.userId === userId)?.roles || [];
  };

  const isUserSelected = (userId: string): boolean => {
    const userRoles = getUserRoles(userId);
    return userRoles.length > 0;
  };

  const totalSelectedUsers = selectedUsersWithRoles.filter(u => u.roles.length > 0).length;

  return (
    <div className="space-y-4">
      <Label className="flex items-center space-x-2">
        <Users className="h-5 w-5" />
        <span className="text-base font-medium">Sélectionner les utilisateurs et leurs rôles ({totalSelectedUsers} sélectionné{totalSelectedUsers !== 1 ? 's' : ''})</span>
      </Label>
      
      {/* User Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher des utilisateurs..."
          value={userSearchQuery}
          onChange={(e) => setUserSearchQuery(e.target.value)}
          className="pl-10 text-base"
        />
      </div>

      {/* Role Legend */}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md">
        <span className="text-sm font-medium text-gray-600">Rôles:</span>
        {MISSION_ROLES.map((role) => {
          const IconComponent = role.icon;
          return (
            <Badge key={role.value} variant="outline" className={`${role.color} flex items-center space-x-1.5 text-sm py-1 px-2`}>
              <IconComponent className="h-3.5 w-3.5" />
              <span>{role.label}</span>
            </Badge>
          );
        })}
      </div>

      {/* Users list with role selection */}
      <div className="max-h-80 overflow-y-auto border rounded-md">
        {activeUsers.length === 0 ? (
          <p className="text-base text-gray-500 text-center py-8">
            {userSearchQuery ? 'Aucun utilisateur trouvé correspondant à votre recherche.' : 'Aucun utilisateur actif disponible.'}
          </p>
        ) : (
          <div className="space-y-0">
            {activeUsers.map((user) => {
              const userRoles = getUserRoles(user.id);
              const isSelected = isUserSelected(user.id);
              
              return (
                <div key={user.id} className={`border-b last:border-b-0 p-4 ${isSelected ? 'bg-blue-50' : 'bg-white'}`}>
                  <div className="flex flex-col space-y-4">
                    {/* User Header */}
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-3.5 w-3.5 text-gray-600" />
                      </div>
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <span className="font-medium text-gray-900 text-base truncate">{user.name}</span>
                        {/* Show role icons next to name */}
                        <div className="flex space-x-1.5">
                          {userRoles.map((roleName) => {
                            const role = MISSION_ROLES.find(r => r.value === roleName);
                            if (!role) return null;
                            const IconComponent = role.icon;
                            
                            return (
                              <IconComponent key={roleName} className={`h-4 w-4 ${role.selectedColor} flex-shrink-0`} />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Role Selection Grid */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 ml-9">
                      {MISSION_ROLES.map((role) => {
                        const IconComponent = role.icon;
                        const isRoleSelected = userRoles.includes(role.value);
                        
                        return (
                          <div key={role.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${user.id}-${role.value}`}
                              checked={isRoleSelected}
                              onCheckedChange={(checked) => 
                                handleRoleToggle(user.id, role.value, checked as boolean)
                              }
                              className="h-4 w-4 flex-shrink-0"
                            />
                            <label 
                              htmlFor={`${user.id}-${role.value}`}
                              className="flex items-center space-x-2 cursor-pointer text-sm min-w-0"
                            >
                              <IconComponent className={`h-4 w-4 flex-shrink-0 ${isRoleSelected ? role.selectedColor : 'text-gray-400'}`} />
                              <span className="truncate">{role.label}</span>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {userSearchQuery && (
        <p className="text-sm text-gray-500">
          Affichage de {activeUsers.length} utilisateur{activeUsers.length !== 1 ? 's' : ''} actif{activeUsers.length !== 1 ? 's' : ''}
        </p>
      )}
      
      {totalSelectedUsers === 0 && (
        <p className="text-base text-gray-500">Veuillez sélectionner au moins un utilisateur avec un rôle pour la mission.</p>
      )}
    </div>
  );
};

export default RoleSelectionSection;

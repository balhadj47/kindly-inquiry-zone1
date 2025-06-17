
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
  filterByRole?: string;
}

const MISSION_ROLES: { value: MissionRole; label: string; icon: React.ComponentType<any>; color: string }[] = [
  { value: 'Chef de Groupe', label: 'Chef de Groupe', icon: Shield, color: 'bg-red-100 text-red-800' },
  { value: 'Chauffeur', label: 'Chauffeur', icon: Car, color: 'bg-blue-100 text-blue-800' },
  { value: 'APS', label: 'APS', icon: UserCheck, color: 'bg-green-100 text-green-800' },
  { value: 'Armé', label: 'Armé', icon: Target, color: 'bg-orange-100 text-orange-800' },
];

const RoleSelectionSection: React.FC<RoleSelectionSectionProps> = ({
  userSearchQuery,
  setUserSearchQuery,
  selectedUsersWithRoles,
  onUserRoleSelection,
  filterByRole,
}) => {
  const { users } = useRBAC();

  // Filter users based on search query and system group
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.systemGroup.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase());
    
    const matchesRole = !filterByRole || user.systemGroup === filterByRole;
    
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
    <div className="space-y-3">
      <Label className="flex items-center space-x-2">
        <Users className="h-4 w-4" />
        <span className="text-sm sm:text-base">Sélectionner les utilisateurs et leurs rôles ({totalSelectedUsers} sélectionné{totalSelectedUsers !== 1 ? 's' : ''})</span>
      </Label>
      
      {/* User Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher des utilisateurs..."
          value={userSearchQuery}
          onChange={(e) => setUserSearchQuery(e.target.value)}
          className="pl-10 text-sm"
        />
      </div>

      {/* Role Legend */}
      <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 rounded-md">
        <span className="text-xs font-medium text-gray-600">Rôles:</span>
        {MISSION_ROLES.map((role) => {
          const IconComponent = role.icon;
          return (
            <Badge key={role.value} variant="outline" className={`${role.color} flex items-center space-x-1 text-xs py-0.5 px-1.5`}>
              <IconComponent className="h-2.5 w-2.5" />
              <span className="hidden sm:inline">{role.label}</span>
            </Badge>
          );
        })}
      </div>

      {/* Users list with role selection */}
      <div className="max-h-80 overflow-y-auto border rounded-md">
        {activeUsers.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">
            {userSearchQuery ? 'Aucun utilisateur trouvé correspondant à votre recherche.' : 'Aucun utilisateur actif disponible.'}
          </p>
        ) : (
          <div className="space-y-0">
            {activeUsers.map((user) => {
              const userRoles = getUserRoles(user.id);
              const isSelected = isUserSelected(user.id);
              
              return (
                <div key={user.id} className={`border-b last:border-b-0 p-2 sm:p-3 ${isSelected ? 'bg-blue-50' : 'bg-white'}`}>
                  <div className="flex flex-col space-y-3">
                    {/* User Header */}
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="h-2.5 w-2.5 text-gray-600" />
                      </div>
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <span className="font-medium text-gray-900 text-sm truncate">{user.name}</span>
                        {/* Show role icons next to name */}
                        <div className="flex space-x-1">
                          {userRoles.map((roleName) => {
                            const role = MISSION_ROLES.find(r => r.value === roleName);
                            if (!role) return null;
                            const IconComponent = role.icon;
                            
                            return (
                              <IconComponent key={roleName} className="h-3 w-3 text-gray-600 flex-shrink-0" />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Role Selection Grid */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 ml-7">
                      {MISSION_ROLES.map((role) => {
                        const IconComponent = role.icon;
                        const isRoleSelected = userRoles.includes(role.value);
                        
                        return (
                          <div key={role.value} className="flex items-center space-x-1.5">
                            <Checkbox
                              id={`${user.id}-${role.value}`}
                              checked={isRoleSelected}
                              onCheckedChange={(checked) => 
                                handleRoleToggle(user.id, role.value, checked as boolean)
                              }
                              className="h-3 w-3 flex-shrink-0"
                            />
                            <label 
                              htmlFor={`${user.id}-${role.value}`}
                              className="flex items-center space-x-1 cursor-pointer text-xs min-w-0"
                            >
                              <IconComponent className="h-2.5 w-2.5 flex-shrink-0" />
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
        <p className="text-xs text-gray-500">
          Affichage de {activeUsers.length} utilisateur{activeUsers.length !== 1 ? 's' : ''} actif{activeUsers.length !== 1 ? 's' : ''}
        </p>
      )}
      
      {totalSelectedUsers === 0 && (
        <p className="text-sm text-gray-500">Veuillez sélectionner au moins un utilisateur avec un rôle pour la mission.</p>
      )}
    </div>
  );
};

export default RoleSelectionSection;

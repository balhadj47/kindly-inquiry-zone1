
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Shield, Car, UserCheck, Target } from 'lucide-react';
import { useRBAC } from '@/contexts/RBACContext';

export type MissionRole = 'Chef de Groupe' | 'Chauffeur' | 'APS' | 'Armé';

interface UserWithRoles {
  userId: string;
  roles: MissionRole[];
}

interface RoleSelectionSectionProps {
  userSearchQuery: string;
  setUserSearchQuery: (query: string) => void;
  selectedUsersWithRoles: UserWithRoles[];
  onUserRoleSelection: (userId: string, roles: MissionRole[]) => void;
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
}) => {
  const { users } = useRBAC();

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

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
        <Users className="h-4 w-4" />
        <span>Sélectionner les utilisateurs et leurs rôles ({totalSelectedUsers} sélectionné{totalSelectedUsers !== 1 ? 's' : ''})</span>
      </Label>
      
      {/* User Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher des utilisateurs par nom, email ou rôle..."
          value={userSearchQuery}
          onChange={(e) => setUserSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Role Legend */}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md">
        <span className="text-sm font-medium text-gray-600">Rôles disponibles:</span>
        {MISSION_ROLES.map((role) => {
          const IconComponent = role.icon;
          return (
            <Badge key={role.value} variant="outline" className={`${role.color} flex items-center space-x-1`}>
              <IconComponent className="h-3 w-3" />
              <span>{role.label}</span>
            </Badge>
          );
        })}
      </div>

      {/* Users list with role selection */}
      <div className="max-h-96 overflow-y-auto border rounded-md">
        {activeUsers.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            {userSearchQuery ? 'Aucun utilisateur trouvé correspondant à votre recherche.' : 'Aucun utilisateur actif disponible.'}
          </p>
        ) : (
          <div className="space-y-0">
            {activeUsers.map((user) => {
              const userRoles = getUserRoles(user.id); // Now using string ID
              const isSelected = isUserSelected(user.id); // Now using string ID
              
              return (
                <div key={user.id} className={`border-b last:border-b-0 p-4 ${isSelected ? 'bg-blue-50' : 'bg-white'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{user.name}</span>
                          <span className="text-sm text-gray-500 ml-2">({user.role})</span>
                          <Badge variant="outline" className="ml-2 text-xs bg-green-100 text-green-800">
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Role Selection Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ml-11">
                        {MISSION_ROLES.map((role) => {
                          const IconComponent = role.icon;
                          const isRoleSelected = userRoles.includes(role.value);
                          
                          return (
                            <div key={role.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${user.id}-${role.value}`}
                                checked={isRoleSelected}
                                onCheckedChange={(checked) => 
                                  handleRoleToggle(user.id, role.value, checked as boolean) // Now using string ID
                                }
                              />
                              <label 
                                htmlFor={`${user.id}-${role.value}`}
                                className="flex items-center space-x-1 cursor-pointer text-sm"
                              >
                                <IconComponent className="h-3 w-3" />
                                <span>{role.label}</span>
                              </label>
                            </div>
                          );
                        })}
                      </div>

                      {/* Selected Roles Display */}
                      {userRoles.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2 ml-11">
                          {userRoles.map((roleName) => {
                            const role = MISSION_ROLES.find(r => r.value === roleName);
                            if (!role) return null;
                            const IconComponent = role.icon;
                            
                            return (
                              <Badge key={roleName} className={`${role.color} text-xs flex items-center space-x-1`}>
                                <IconComponent className="h-3 w-3" />
                                <span>{role.label}</span>
                              </Badge>
                            );
                          })}
                        </div>
                      )}
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

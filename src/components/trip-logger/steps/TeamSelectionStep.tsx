import React from 'react';
import { Users } from 'lucide-react';
import { UserWithRoles } from '@/hooks/useTripForm';
import { MissionRole, MISSION_ROLES } from '@/types/missionRoles';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Shield, Car, UserCheck, Target } from 'lucide-react';
import { useUsersByRoleId } from '@/hooks/users';
import { useActiveTrips } from '@/hooks/trips/useActiveTrips';
import { Badge } from '@/components/ui/badge';

interface TeamSelectionStepProps {
  userSearchQuery: string;
  setUserSearchQuery: (query: string) => void;
  selectedUsersWithRoles: UserWithRoles[];
  onUserRoleSelection: (userId: string, roles: MissionRole[]) => void;
}

const MISSION_ROLE_ICONS = {
  'Chef de Groupe': { icon: Shield, color: 'bg-red-100 text-red-800', selectedColor: 'text-red-600' },
  'Chauffeur': { icon: Car, color: 'bg-blue-100 text-blue-800', selectedColor: 'text-blue-600' },
  'APS': { icon: UserCheck, color: 'bg-green-100 text-green-800', selectedColor: 'text-green-600' },
  'Armé': { icon: Target, color: 'bg-orange-100 text-orange-800', selectedColor: 'text-orange-600' }
};

const TeamSelectionStep: React.FC<TeamSelectionStepProps> = ({
  userSearchQuery,
  setUserSearchQuery,
  selectedUsersWithRoles,
  onUserRoleSelection
}) => {
  // Use the optimized employees hook (role_id: 3) instead of RBAC context
  const { data: employees = [], isLoading: loading, error } = useUsersByRoleId(3);
  
  // Get active trips to filter out employees already on missions
  const { data: activeTrips = [] } = useActiveTrips();

  // Transform optimized user data to match expected format
  const users = React.useMemo(() => {
    if (loading || error || !employees || !Array.isArray(employees)) {
      return [];
    }

    // Transform the optimized user data to match the expected format
    return employees.map(emp => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      status: emp.status,
      badge_number: emp.badge_number,
      role_id: emp.role_id || 3 // Ensure role_id is included
    }));
  }, [employees, loading, error]);

  // Get user IDs that are currently on active missions
  const usersOnActiveMissions = React.useMemo(() => {
    const activeUserIds = new Set<string>();
    
    activeTrips.forEach(trip => {
      // Check user_roles for user assignments (correct property name)
      if (trip.user_roles && Array.isArray(trip.user_roles)) {
        trip.user_roles.forEach((userRole: any) => {
          activeUserIds.add(userRole.userId?.toString() || userRole.user_id?.toString());
        });
      }
      
      // Also check user_ids as fallback (correct property name)
      if (trip.user_ids && Array.isArray(trip.user_ids)) {
        trip.user_ids.forEach(userId => {
          activeUserIds.add(userId.toString());
        });
      }
    });
    
    console.log('🚫 Users on active missions:', Array.from(activeUserIds));
    return activeUserIds;
  }, [activeTrips]);

  // Safely handle users data and filter out those on active missions
  const availableUsers = React.useMemo(() => {
    if (!Array.isArray(users)) {
      return [];
    }

    // Filter out invalid users, users on active missions, and ensure they have required fields
    return users.filter(user => {
      const isValidUser = user && 
             user.id && 
             user.name && 
             typeof user.name === 'string' &&
             user.name.trim().length > 0;
      
      const isOnActiveMission = usersOnActiveMissions.has(user.id.toString());
      
      return isValidUser && !isOnActiveMission;
    });
  }, [users, usersOnActiveMissions]);

  // Filter users based on search
  const filteredUsers = React.useMemo(() => {
    if (!userSearchQuery.trim()) {
      return availableUsers;
    }

    const searchLower = userSearchQuery.toLowerCase().trim();
    return availableUsers.filter(user => {
      return user.name.toLowerCase().includes(searchLower) ||
             (user.email && user.email.toLowerCase().includes(searchLower)) ||
             (user.badge_number && user.badge_number.toLowerCase().includes(searchLower));
    });
  }, [availableUsers, userSearchQuery]);

  // Sort users: active first, then by name
  const sortedUsers = React.useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      if (a.status === 'Active' && b.status !== 'Active') return -1;
      if (a.status !== 'Active' && b.status === 'Active') return 1;
      return (a.name || '').localeCompare(b.name || '');
    });
  }, [filteredUsers]);

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

  // Validation: Check if we have required roles
  const hasChefDeGroupe = selectedUsersWithRoles.some(u => u.roles.includes('Chef de Groupe'));
  const hasChauffeur = selectedUsersWithRoles.some(u => u.roles.includes('Chauffeur'));

  // Show loading state if still loading
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sélection de l'équipe</h3>
          <p className="text-gray-600">Chargement des employés...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
          <Users className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Sélection de l'équipe</h3>
        <p className="text-gray-600">Sélectionnez les employés et leurs rôles pour cette mission</p>
      </div>

      {/* Validation Messages */}
      {(!hasChefDeGroupe || !hasChauffeur) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <div className="text-yellow-600">⚠️</div>
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Rôles obligatoires manquants:</p>
              <ul className="list-disc list-inside space-y-1">
                {!hasChefDeGroupe && <li>Au moins un <strong>Chef de Groupe</strong> est requis</li>}
                {!hasChauffeur && <li>Au moins un <strong>Chauffeur</strong> est requis</li>}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* User Search */}
      <div className="space-y-4">
        <Label className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Employés disponibles ({totalSelectedUsers} sélectionnés sur {sortedUsers.length} disponibles)</span>
          {usersOnActiveMissions.size > 0 && (
            <Badge variant="secondary" className="text-xs">
              {usersOnActiveMissions.size} en mission
            </Badge>
          )}
        </Label>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un employé..."
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Role Legend */}
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md">
          <span className="text-sm font-medium text-gray-600">Rôles disponibles:</span>
          {MISSION_ROLES.map((role) => {
            const roleConfig = MISSION_ROLE_ICONS[role.name];
            if (!roleConfig) return null;
            const IconComponent = roleConfig.icon;
            return (
              <Badge key={role.id} variant="outline" className={`${roleConfig.color} flex items-center space-x-1.5 text-sm py-1 px-2`}>
                <IconComponent className="h-3.5 w-3.5" />
                <span>{role.name}</span>
              </Badge>
            );
          })}
        </div>

        {/* Users List */}
        <div className="max-h-96 overflow-y-auto border rounded-md">
          {sortedUsers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500">
                {userSearchQuery ? 
                  `Aucun employé disponible trouvé pour "${userSearchQuery}".` : 
                  'Aucun employé disponible (tous sont peut-être en mission).'
                }
              </p>
              {error && (
                <p className="text-xs text-red-500 mt-2">
                  Erreur: {error.message}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-0">
              {sortedUsers.map((user) => {
                const userRoles = getUserRoles(user.id.toString());
                const isSelected = isUserSelected(user.id.toString());
                const isActive = user.status === 'Active';
                
                return (
                  <div key={user.id} className={`border-b last:border-b-0 p-4 ${isSelected ? 'bg-blue-50' : 'bg-white'} ${!isActive ? 'opacity-50' : ''}`}>
                    <div className="flex flex-col space-y-4">
                      {/* User Header */}
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="h-3.5 w-3.5 text-gray-600" />
                        </div>
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <span className="font-medium text-gray-900 text-base truncate">{user.name}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.status === 'Active' ? 'bg-green-100 text-green-800' :
                            user.status === 'Récupération' ? 'bg-yellow-100 text-yellow-800' :
                            user.status === 'Congé' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {user.status || 'Statut inconnu'}
                          </span>
                          {/* Show role icons next to name */}
                          <div className="flex space-x-1.5">
                            {userRoles.map((roleName) => {
                              const roleConfig = MISSION_ROLE_ICONS[roleName];
                              if (!roleConfig) return null;
                              const IconComponent = roleConfig.icon;
                              
                              return (
                                <IconComponent key={roleName} className={`h-4 w-4 ${roleConfig.selectedColor} flex-shrink-0`} />
                              );
                            })}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          {user.badge_number && (
                            <span>Badge: {user.badge_number}</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Role Selection Grid - Only show for active users */}
                      {isActive && (
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 ml-9">
                          {MISSION_ROLES.map((role) => {
                            const roleConfig = MISSION_ROLE_ICONS[role.name];
                            if (!roleConfig) return null;
                            const IconComponent = roleConfig.icon;
                            const isRoleSelected = userRoles.includes(role.name);
                            
                            return (
                              <div key={role.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${user.id}-${role.name}`}
                                  checked={isRoleSelected}
                                  onCheckedChange={(checked) => 
                                    handleRoleToggle(user.id.toString(), role.name, checked as boolean)
                                  }
                                  className="h-4 w-4 flex-shrink-0"
                                />
                                <label 
                                  htmlFor={`${user.id}-${role.name}`}
                                  className="flex items-center space-x-2 cursor-pointer text-sm min-w-0"
                                >
                                  <IconComponent className={`h-4 w-4 flex-shrink-0 ${isRoleSelected ? roleConfig.selectedColor : 'text-gray-400'}`} />
                                  <span className="truncate">{role.name}</span>
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {userSearchQuery && (
          <p className="text-xs text-gray-500">
            {sortedUsers.length} employé(s) disponible(s) trouvé(s)
          </p>
        )}
        
        {totalSelectedUsers === 0 && (
          <p className="text-sm text-gray-500">Veuillez sélectionner au moins un employé avec un rôle pour la mission.</p>
        )}
      </div>
    </div>
  );
};

export default TeamSelectionStep;

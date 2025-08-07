
import React, { useState, useMemo } from 'react';
import { Search, Plus, X, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUsersByRoleId } from '@/hooks/users';
import { User as RBACUser } from '@/types/rbac';

export interface UserWithRole {
  userId: string;
  roles?: string[];
  role?: string;
}

interface TeamMemberSelectorProps {
  userSearchQuery: string;
  setUserSearchQuery: (query: string) => void;
  selectedUsersWithRoles: UserWithRole[];
  onUserRoleSelection: (userId: string, role: string) => void;
}

const roleOptions = [
  { value: 'conducteur', label: 'Conducteur' },
  { value: 'passager', label: 'Passager' },
  { value: 'superviseur', label: 'Superviseur' }
];

// Helper function to transform database user to RBAC User type
const transformDatabaseUserToRBACUser = (dbUser: any): RBACUser => {
  console.log('🔄 TeamMemberSelector: Transforming database user:', dbUser);
  return {
    id: dbUser.id.toString(),
    name: dbUser.name,
    email: dbUser.email,
    phone: dbUser.phone,
    role_id: dbUser.role_id,
    status: dbUser.status,
    createdAt: dbUser.created_at,
    profileImage: dbUser.profile_image,
    totalTrips: dbUser.total_trips,
    lastTrip: dbUser.last_trip,
    badgeNumber: dbUser.badge_number,
    dateOfBirth: dbUser.date_of_birth,
    placeOfBirth: dbUser.place_of_birth,
    address: dbUser.address,
    driverLicense: dbUser.driver_license,
  };
};

const TeamMemberSelector: React.FC<TeamMemberSelectorProps> = ({
  userSearchQuery,
  setUserSearchQuery,
  selectedUsersWithRoles,
  onUserRoleSelection
}) => {
  console.log('🔄 TeamMemberSelector: Component render with selectedUsersWithRoles:', selectedUsersWithRoles);
  
  const { data: employees, isLoading, error } = useUsersByRoleId(3);
  const [selectedRole, setSelectedRole] = useState<string>('conducteur');

  console.log('🔄 TeamMemberSelector: Employees data:', employees, 'Loading:', isLoading, 'Error:', error);

  // Transform database users to RBAC Users
  const transformedEmployees = useMemo(() => {
    if (!employees) {
      console.log('🔄 TeamMemberSelector: No employees data available');
      return [];
    }
    console.log('🔄 TeamMemberSelector: Transforming employees:', employees.length);
    return employees.map(transformDatabaseUserToRBACUser);
  }, [employees]);

  const availableEmployees = useMemo(() => {
    // Filter out already selected employees
    const selectedUserIds = selectedUsersWithRoles.map(u => u.userId);
    console.log('🔄 TeamMemberSelector: Selected user IDs:', selectedUserIds);
    const available = transformedEmployees.filter(emp => !selectedUserIds.includes(emp.id));
    console.log('🔄 TeamMemberSelector: Available employees:', available.length);
    return available;
  }, [transformedEmployees, selectedUsersWithRoles]);

  const filteredEmployees = useMemo(() => {
    if (!userSearchQuery.trim()) return availableEmployees;
    
    const filtered = availableEmployees.filter(employee =>
      employee.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      (employee.phone && employee.phone.toLowerCase().includes(userSearchQuery.toLowerCase()))
    );
    console.log('🔄 TeamMemberSelector: Filtered employees for query "' + userSearchQuery + '":', filtered.length);
    return filtered;
  }, [availableEmployees, userSearchQuery]);

  const selectedEmployees = useMemo(() => {
    const selected = selectedUsersWithRoles.map(userRole => {
      const employee = transformedEmployees.find(emp => emp.id === userRole.userId);
      if (!employee) {
        console.warn('🔄 TeamMemberSelector: Employee not found for userId:', userRole.userId);
        return null;
      }
      return { ...employee, assignedRole: userRole.role || userRole.roles?.[0] || 'conducteur' };
    }).filter(Boolean) as (RBACUser & { assignedRole: string })[];
    console.log('🔄 TeamMemberSelector: Selected employees with roles:', selected);
    return selected;
  }, [transformedEmployees, selectedUsersWithRoles]);

  const handleAddEmployee = (employee: RBACUser) => {
    console.log('🔄 TeamMemberSelector: Adding employee:', employee.id, 'with role:', selectedRole);
    onUserRoleSelection(employee.id, selectedRole);
    setUserSearchQuery('');
    setSelectedRole('conducteur');
  };

  const handleRemoveEmployee = (userId: string) => {
    console.log('🔄 TeamMemberSelector: Removing employee:', userId);
    onUserRoleSelection(userId, '');
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    console.log('🔄 TeamMemberSelector: Changing role for user:', userId, 'to:', newRole);
    onUserRoleSelection(userId, newRole);
  };

  if (error) {
    console.error('🔴 TeamMemberSelector: Error loading employees:', error);
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-red-600">
          Erreur lors du chargement des employés
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Employee Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Ajouter des membres à l'équipe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="employee-search">Rechercher un employé</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="employee-search"
                placeholder="Nom, email ou téléphone..."
                value={userSearchQuery}
                onChange={(e) => {
                  console.log('🔄 TeamMemberSelector: Search query changed:', e.target.value);
                  setUserSearchQuery(e.target.value);
                }}
                className="pl-10"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role-select">Rôle à attribuer</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Employee List */}
          {isLoading ? (
            <div className="text-center py-4 text-muted-foreground">
              Chargement des employés...
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              {userSearchQuery.trim() 
                ? 'Aucun employé trouvé pour cette recherche'
                : 'Aucun employé disponible'
              }
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{employee.name}</div>
                    <div className="text-sm text-muted-foreground truncate">{employee.email}</div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddEmployee(employee)}
                    className="ml-2 shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Team Members */}
      {selectedEmployees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Équipe sélectionnée
              <Badge variant="secondary" className="ml-2">
                {selectedEmployees.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-accent/20"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{employee.name}</div>
                    <div className="text-sm text-muted-foreground truncate">{employee.email}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Select
                      value={employee.assignedRole}
                      onValueChange={(value) => handleRoleChange(employee.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveEmployee(employee.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamMemberSelector;

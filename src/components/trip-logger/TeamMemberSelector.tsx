
import React, { useState, useMemo } from 'react';
import { Search, Plus, X, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUsersByRoleId } from '@/hooks/users';
import { User as RBACUser } from '@/types/rbac';

export interface UserWithRole {
  userId: string;
  role: string;
}

interface TeamMemberSelectorProps {
  userSearchQuery: string;
  setUserSearchQuery: (query: string) => void;
  selectedUsersWithRoles: UserWithRole[];
  onUserRoleSelection: (userId: string, role: string) => void;
}

const ROLE_OPTIONS = [
  { value: 'conducteur', label: 'Conducteur' },
  { value: 'passager', label: 'Passager' },
  { value: 'superviseur', label: 'Superviseur' }
];

// Helper function to transform database user to RBAC User type
const transformDatabaseUserToRBACUser = (dbUser: any): RBACUser => ({
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
});

const TeamMemberSelector: React.FC<TeamMemberSelectorProps> = ({
  userSearchQuery,
  setUserSearchQuery,
  selectedUsersWithRoles,
  onUserRoleSelection,
}) => {
  const { data: employees, isLoading } = useUsersByRoleId(3);
  const [selectedRole, setSelectedRole] = useState<string>('conducteur');

  // Transform database users to RBAC Users
  const transformedEmployees = useMemo(() => {
    if (!employees) return [];
    return employees.map(transformDatabaseUserToRBACUser);
  }, [employees]);

  const availableEmployees = useMemo(() => {
    // Filter out already selected employees
    const selectedUserIds = selectedUsersWithRoles.map(u => u.userId);
    return transformedEmployees.filter(emp => !selectedUserIds.includes(emp.id));
  }, [transformedEmployees, selectedUsersWithRoles]);

  const filteredEmployees = useMemo(() => {
    if (!userSearchQuery.trim()) return availableEmployees;
    
    const query = userSearchQuery.toLowerCase();
    return availableEmployees.filter(employee =>
      employee.name.toLowerCase().includes(query) ||
      employee.email?.toLowerCase().includes(query) ||
      employee.badgeNumber?.toLowerCase().includes(query)
    );
  }, [availableEmployees, userSearchQuery]);

  const selectedEmployees = useMemo(() => {
    return selectedUsersWithRoles.map(userRole => {
      const employee = transformedEmployees.find(emp => emp.id === userRole.userId);
      return employee ? { ...employee, assignedRole: userRole.role } : null;
    }).filter(Boolean) as (RBACUser & { assignedRole: string })[];
  }, [transformedEmployees, selectedUsersWithRoles]);

  const handleAddEmployee = (employee: RBACUser) => {
    onUserRoleSelection(employee.id, selectedRole);
    setUserSearchQuery('');
    setSelectedRole('conducteur');
  };

  const handleRemoveEmployee = (userId: string) => {
    onUserRoleSelection(userId, '');
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    onUserRoleSelection(userId, newRole);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Employee Search and Add Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5" />
            Ajouter un Membre d'Équipe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un employé (nom, email, badge)..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Role Selection */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 min-w-0">
              Rôle:
            </label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Employee Results */}
          {userSearchQuery && (
            <div className="max-h-64 overflow-y-auto border rounded-lg">
              {filteredEmployees.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Aucun employé trouvé
                </div>
              ) : (
                <div className="divide-y">
                  {filteredEmployees.map(employee => (
                    <div key={employee.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={employee.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${employee.name}`}
                            alt={employee.name}
                          />
                          <AvatarFallback className="text-xs">
                            {getUserInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{employee.name}</div>
                          <div className="text-xs text-gray-500">
                            {employee.badgeNumber && `Badge: ${employee.badgeNumber}`}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddEmployee(employee)}
                        className="h-8 px-3"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Team Members */}
      {selectedEmployees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Équipe Sélectionnée ({selectedEmployees.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedEmployees.map(employee => (
                <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={employee.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${employee.name}`}
                        alt={employee.name}
                      />
                      <AvatarFallback>
                        {getUserInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-gray-500">
                        {employee.badgeNumber && `Badge: ${employee.badgeNumber}`}
                      </div>
                    </div>
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
                        {ROLE_OPTIONS.map(role => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Badge variant="secondary">
                      {ROLE_OPTIONS.find(r => r.value === employee.assignedRole)?.label}
                    </Badge>
                    
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

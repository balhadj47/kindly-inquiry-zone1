
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

  // Filter to show only employees (role_id: 3) and apply search
  const employees = users.filter(user => {
    const isEmployee = user.role_id === 3;
    const matchesSearch = !userSearchQuery || 
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase());
    return isEmployee && matchesSearch;
  });

  // Sort employees: active first, then by name
  const sortedEmployees = employees.sort((a, b) => {
    if (a.status === 'Active' && b.status !== 'Active') return -1;
    if (a.status !== 'Active' && b.status === 'Active') return 1;
    return a.name.localeCompare(b.name);
  });

  const handleEmployeeToggle = (userId: string, checked: boolean) => {
    if (checked) {
      // Add employee with default role
      onUserRoleSelection(userId, []);
    } else {
      // Remove employee
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
        <p className="text-gray-600">Sélectionnez les employés pour cette mission</p>
      </div>

      {/* Employee Search */}
      <div className="space-y-4">
        <Label className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>Employés ({selectedUsersWithRoles.length} sélectionnés)</span>
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

        {/* Employees List */}
        <div className="max-h-96 overflow-y-auto border rounded-md">
          {sortedEmployees.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              {userSearchQuery ? 'Aucun employé trouvé.' : 'Aucun employé disponible.'}
            </p>
          ) : (
            <div className="p-3 space-y-3">
              {sortedEmployees.map((employee) => {
                const isSelected = selectedUsersWithRoles.some(u => u.userId === employee.id.toString());
                const isActive = employee.status === 'Active';
                const isDisabled = !isActive;
                
                return (
                  <div key={employee.id} className={`flex items-center space-x-3 ${isDisabled ? 'opacity-50' : ''}`}>
                    <Checkbox
                      id={`employee-${employee.id}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => handleEmployeeToggle(employee.id.toString(), checked as boolean)}
                      disabled={isDisabled}
                    />
                    <label 
                      htmlFor={`employee-${employee.id}`} 
                      className={`flex-1 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{employee.name}</span>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                            employee.status === 'Active' ? 'bg-green-100 text-green-800' :
                            employee.status === 'Récupération' ? 'bg-yellow-100 text-yellow-800' :
                            employee.status === 'Congé' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {employee.status}
                          </span>
                        </div>
                        {employee.badgeNumber && (
                          <span className="text-xs text-gray-400">Badge: {employee.badgeNumber}</span>
                        )}
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
            {sortedEmployees.length} employé(s) trouvé(s)
          </p>
        )}
        
        {selectedUsersWithRoles.length === 0 && (
          <p className="text-sm text-gray-500">Veuillez sélectionner au moins un employé pour la mission.</p>
        )}
      </div>
    </div>
  );
};

export default TeamSelectionStep;

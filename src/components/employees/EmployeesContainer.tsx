
import React from 'react';
import { useUsersByRoleId } from '@/hooks/useUsersOptimized';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { useEmployeePermissions } from '@/hooks/useEmployeePermissions';
import EmployeesHeader from './EmployeesHeader';
import EmployeesActions from './EmployeesActions';
import EmployeesList from './EmployeesList';
import EmployeesFilters from './EmployeesFilters';
import UserDialog from '../user-dialog/UserDialog';
import EmployeeDeleteDialog from './EmployeeDeleteDialog';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

// Define the interface for employee data to match what we're using
interface Employee {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  badge_number?: string;
  status: string;
  role_id?: number;
  created_at?: string;
  auth_user_id?: string;
  profile_image?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  address?: string;
  driver_license?: string;
  total_trips?: number;
  last_trip?: string;
}

const EmployeesContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { data: employeesData = [], refetch } = useUsersByRoleId(3);
  // Transform the data to match our interface
  const employees: Employee[] = employeesData.map(emp => ({
    ...emp,
    id: emp.id?.toString() || '',
  }));
  
  const permissions = useEmployeePermissions();
  
  const {
    isModalOpen,
    setIsModalOpen,
    isDeleteDialogOpen,
    selectedEmployee,
    handleAddEmployee,
    handleEditEmployee,
    handleDeleteEmployee,
    handleConfirmDelete,
    handleCancelDelete,
  } = useEmployeeActions(refetch);

  console.log('🏢 EmployeesContainer: Rendering with employees:', employees.length);

  if (!permissions.hasUsersReadPermission) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Accès non autorisé</h2>
        <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à la gestion des employés.</p>
      </div>
    );
  }

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = !searchTerm || 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.badge_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <EmployeesHeader employeesCount={employees.length} />
        <EmployeesActions 
          onCreateEmployee={handleAddEmployee}
          onRefresh={refetch}
          canCreateEmployees={permissions.canCreateUsers}
        />
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <EmployeesFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            clearFilters={clearFilters}
            employees={employees}
          />
        </CardContent>
      </Card>

      <EmployeesList
        employees={filteredEmployees}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onEditEmployee={handleEditEmployee}
        onDeleteEmployee={handleDeleteEmployee}
        canEdit={permissions.canEditUsers}
        canDelete={permissions.canDeleteUsers}
      />

      <UserDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedEmployee}
        userType="employee"
        onRefresh={refetch}
      />

      <EmployeeDeleteDialog
        isOpen={isDeleteDialogOpen}
        onCancel={handleCancelDelete}
        employee={selectedEmployee}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default EmployeesContainer;

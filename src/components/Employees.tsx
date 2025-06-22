
import React, { useState, useEffect } from 'react';
import { useRBAC } from '@/contexts/RBACContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { User } from '@/types/rbac';
import EmployeesHeader from './employees/EmployeesHeader';
import EmployeesFilters from './employees/EmployeesFilters';
import EmployeesList from './employees/EmployeesList';
import EmployeeModal from './employees/EmployeeModal';
import EmployeeDeleteDialog from './employees/EmployeeDeleteDialog';
import { useCacheRefresh } from '@/hooks/useCacheRefresh';
import { RefreshButton } from '@/components/ui/refresh-button';

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  
  const { users, hasPermission, loading, currentUser } = useRBAC();
  const { user: authUser } = useAuth();
  const { refreshPage } = useCacheRefresh();

  // Filter users to show only employees (role_id: 3)
  const employees = users?.filter(user => user.role_id === 3) || [];

  // Refresh data when component mounts
  useEffect(() => {
    console.log('👥 Employees component mounted, refreshing data');
    refreshPage(['users', 'user_groups']);
  }, [refreshPage]);

  const handleRefresh = () => {
    console.log('🔄 Employees: Manual refresh triggered');
    refreshPage(['users', 'user_groups']);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: User) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = (employee: User) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // TODO: Implement delete functionality
    console.log('Deleting employee:', selectedEmployee);
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  // Check permissions
  const canCreateUsers = hasPermission('users:create');
  const canEditUsers = hasPermission('users:update');
  const canDeleteUsers = hasPermission('users:delete');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des employés...</div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Authentification requise</h2>
        <p className="text-gray-600">Vous devez être connecté pour accéder à la gestion des employés.</p>
      </div>
    );
  }

  const isKnownAdmin = authUser.email === 'gb47@msn.com';
  const hasUsersReadPermission = hasPermission('users:read') || isKnownAdmin;

  if (!hasUsersReadPermission) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Accès non autorisé</h2>
        <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à la gestion des employés.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <EmployeesHeader employeesCount={employees.length} />
        <div className="flex items-center space-x-2">
          {canCreateUsers && (
            <Button onClick={handleAddEmployee} variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          )}
          <RefreshButton onRefresh={handleRefresh} />
        </div>
      </div>

      <EmployeesFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        clearFilters={clearFilters}
        employees={employees}
      />

      <EmployeesList
        employees={employees}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onEditEmployee={handleEditEmployee}
        onDeleteEmployee={handleDeleteEmployee}
        canEdit={canEditUsers}
        canDelete={canDeleteUsers}
      />

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={selectedEmployee}
      />

      <EmployeeDeleteDialog
        isOpen={isDeleteDialogOpen}
        employee={selectedEmployee}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default Employees;

import React, { useState, useEffect } from 'react';
import { useRBAC } from '@/contexts/RBACContext';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/rbac';
import EmployeesHeader from './employees/EmployeesHeader';
import EmployeesFilters from './employees/EmployeesFilters';
import EmployeesList from './employees/EmployeesList';
import EmployeeModal from './employees/EmployeeModal';
import { LoadingState, ErrorState } from './users/UsersStates';
import { useCacheRefresh } from '@/hooks/useCacheRefresh';
import { RefreshButton } from '@/components/ui/refresh-button';

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { users, hasPermission, loading, currentUser } = useRBAC();
  const { user: authUser } = useAuth();
  const { refreshPage } = useCacheRefresh();

  // Filter only employees (role_id: 3) - keeping it consistent
  const employees = users.filter(user => user.role_id === 3);

  // Check permissions
  const canCreateEmployees = hasPermission('users:create');
  const canEditEmployees = hasPermission('users:update');
  const canDeleteEmployees = hasPermission('users:delete');

  // Refresh data when component mounts
  useEffect(() => {
    console.log('👥 Employees component mounted, refreshing data');
    refreshPage(['users']);
  }, [refreshPage]);

  const handleRefresh = () => {
    refreshPage(['users']);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: User) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  if (loading) {
    return <LoadingState />;
  }

  // Check if user has permission to view employees
  if (!hasPermission('users:read') && !hasPermission('dashboard:read')) {
    return (
      <ErrorState
        title="Accès non autorisé"
        message="Vous n'avez pas les permissions nécessaires pour accéder à la gestion des employés."
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <EmployeesHeader 
          onAddEmployee={handleAddEmployee}
          canCreate={canCreateEmployees}
          employeesCount={employees.length}
        />
        <RefreshButton onRefresh={handleRefresh} />
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
        canEdit={canEditEmployees}
        canDelete={canDeleteEmployees}
      />

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default Employees;

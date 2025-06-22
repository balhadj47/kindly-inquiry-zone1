
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { User } from '@/types/rbac';
import EmployeesHeader from './employees/EmployeesHeader';
import EmployeesFilters from './employees/EmployeesFilters';
import EmployeesList from './employees/EmployeesList';
import EmployeeModal from './employees/EmployeeModal';
import EmployeeDeleteDialog from './employees/EmployeeDeleteDialog';
import { RefreshButton } from '@/components/ui/refresh-button';
import { useToast } from '@/hooks/use-toast';
import { useUsersByRoleId, useUserMutations } from '@/hooks/useUsersOptimized';
import { useModernRefresh } from '@/hooks/useModernRefresh';
import { hasPermission } from '@/utils/rolePermissions';

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  
  // Use the optimized hook for employees (role_id: 3)
  const { data: employees = [], isLoading: loading, refetch } = useUsersByRoleId(3);
  const { deleteUser } = useUserMutations();
  const { modernRefresh, isRefreshing } = useModernRefresh<User>();

  // Refresh data when component mounts
  useEffect(() => {
    console.log('👥 Employees component mounted, refreshing data');
    refetch();
  }, [refetch]);

  const handleRefresh = async () => {
    console.log('🔄 Employees: Manual refresh triggered');
    await modernRefresh(
      employees,
      async () => {
        const result = await refetch();
        return result.data || [];
      },
      () => {}, // No need to update state, React Query handles it
      { showToast: true }
    );
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

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;
    
    try {
      console.log('Deleting employee:', selectedEmployee);
      await deleteUser.mutateAsync(selectedEmployee.id);
      
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
      
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
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
  const canCreateUsers = authUser ? hasPermission(authUser, 'users:create') : false;
  const canEditUsers = authUser ? hasPermission(authUser, 'users:update') : false;
  const canDeleteUsers = authUser ? hasPermission(authUser, 'users:delete') : false;

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
  const hasUsersReadPermission = hasPermission(authUser, 'users:read') || isKnownAdmin;

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
          <RefreshButton onRefresh={handleRefresh} disabled={isRefreshing} />
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

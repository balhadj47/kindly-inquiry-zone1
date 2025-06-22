import React, { useState, useEffect } from 'react';
import { useRBAC } from '@/contexts/RBACContext';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types/rbac';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import EmployeesHeader from './employees/EmployeesHeader';
import EmployeesFilters from './employees/EmployeesFilters';
import EmployeesList from './employees/EmployeesList';
import EmployeeModal from './employees/EmployeeModal';
import EmployeeDeleteDialog from './employees/EmployeeDeleteDialog';
import { LoadingState, ErrorState } from './users/UsersStates';
import { useCacheRefresh } from '@/hooks/useCacheRefresh';
import { RefreshButton } from '@/components/ui/refresh-button';
import { useToast } from '@/hooks/use-toast';

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteEmployee, setDeleteEmployee] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { users, hasPermission, loading, deleteUser } = useRBAC();
  const { user: authUser } = useAuth();
  const { refreshPage } = useCacheRefresh();
  const { toast } = useToast();

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

  const handleDeleteEmployee = (employee: User) => {
    setDeleteEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteEmployee = async () => {
    if (!deleteEmployee) return;

    try {
      await deleteUser(deleteEmployee.id);
      toast({
        title: "Employé supprimé",
        description: `L'employé ${deleteEmployee.name} a été supprimé avec succès.`,
      });
      setIsDeleteDialogOpen(false);
      setDeleteEmployee(null);
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'employé.",
        variant: "destructive",
      });
    }
  };

  const cancelDeleteEmployee = () => {
    setIsDeleteDialogOpen(false);
    setDeleteEmployee(null);
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
          employeesCount={employees.length}
        />
        <div className="flex items-center space-x-2">
          {canCreateEmployees && (
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
        canEdit={canEditEmployees}
        canDelete={canDeleteEmployees}
      />

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={selectedEmployee}
      />

      <EmployeeDeleteDialog
        isOpen={isDeleteDialogOpen}
        employee={deleteEmployee}
        onConfirm={confirmDeleteEmployee}
        onCancel={cancelDeleteEmployee}
      />
    </div>
  );
};

export default Employees;

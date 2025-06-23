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
import { roleIdHasPermission } from '@/utils/rolePermissions';

// Helper function to transform optimized user data to RBAC User type
const transformOptimizedUser = (user: any): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role_id: user.role_id,
  status: user.status,
  createdAt: user.created_at, // Transform created_at to createdAt
  totalTrips: user.total_trips,
  lastTrip: user.last_trip,
  profileImage: user.profile_image,
  badgeNumber: user.badge_number,
  dateOfBirth: user.date_of_birth,
  placeOfBirth: user.place_of_birth,
  address: user.address,
  driverLicense: user.driver_license,
});

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  
  const { user: authUser } = useAuth();
  const { toast } = useToast();
  
  // Use the optimized hook for employees (role_id: 3)
  const { data: rawEmployees = [], isLoading: loading, refetch } = useUsersByRoleId(3);
  const { deleteUser } = useUserMutations();
  const { modernRefresh, isRefreshing } = useModernRefresh<User>();

  // Transform the raw employees data to match RBAC User type
  const employees: User[] = rawEmployees.map(transformOptimizedUser);

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
        return (result.data || []).map(transformOptimizedUser);
      },
      () => {}, // No need to update state, React Query handles it
      { showToast: true }
    );
  };

  const handleAddEmployee = () => {
    console.log('🆕 Employees: Adding new employee');
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: User) => {
    console.log('✏️ Employees: Editing employee:', employee.id, employee.name);
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = (employee: User) => {
    console.log('🗑️ Employees: Preparing to delete employee:', employee.id, employee.name);
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) {
      console.error('❌ Employees: No employee selected for deletion');
      return;
    }
    
    try {
      console.log('🗑️ Employees: Confirming deletion of employee:', selectedEmployee.id, selectedEmployee.name);
      await deleteUser.mutateAsync(selectedEmployee.id);
      
      console.log('✅ Employees: Employee deleted successfully:', selectedEmployee.id);
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
      
      toast({
        title: 'Succès',
        description: `Employé ${selectedEmployee.name} supprimé avec succès`,
      });
      
      // Refresh the data after successful deletion
      refetch();
      
    } catch (error) {
      console.error('❌ Employees: Error deleting employee:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'employé. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelDelete = () => {
    console.log('❌ Employees: Canceling employee deletion');
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  // Check permissions using role_id - safely access the property with detailed logging
  const userRoleId = (authUser as any)?.role_id || 0;
  console.log('🔐 Employees: Current user role_id:', userRoleId);
  console.log('🔐 Employees: Current user email:', authUser?.email);
  
  const canCreateUsers = authUser ? roleIdHasPermission(userRoleId, 'users:create') : false;
  const canEditUsers = authUser ? roleIdHasPermission(userRoleId, 'users:update') : false;
  const canDeleteUsers = authUser ? roleIdHasPermission(userRoleId, 'users:delete') : false;
  
  console.log('🔐 Employees: Permissions - Create:', canCreateUsers, 'Edit:', canEditUsers, 'Delete:', canDeleteUsers);

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
  const hasUsersReadPermission = roleIdHasPermission(userRoleId, 'users:read') || isKnownAdmin;

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

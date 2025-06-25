
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { User } from '@/types/rbac';
import EmployeesHeader from './EmployeesHeader';
import EmployeesFilters from './EmployeesFilters';
import EmployeesList from './EmployeesList';
import EmployeeModal from './EmployeeModal';
import EmployeeDeleteDialog from './EmployeeDeleteDialog';
import { useUsersByRoleId } from '@/hooks/useUsersOptimized';
import { useModernRefresh } from '@/hooks/useModernRefresh';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { useEmployeePermissions } from '@/hooks/useEmployeePermissions';

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

const EmployeesContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use the optimized hook for employees (role_id: 3)
  const { data: rawEmployees = [], isLoading: loading, refetch } = useUsersByRoleId(3);
  const { modernRefresh } = useModernRefresh<User>();

  // Transform the raw employees data to match RBAC User type
  const employees: User[] = rawEmployees.map(transformOptimizedUser);

  // Use custom hooks for actions and permissions
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

  const {
    authUser,
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,
    hasUsersReadPermission,
  } = useEmployeePermissions();

  // Refresh data when component mounts
  useEffect(() => {
    console.log('👥 Employees component mounted, refreshing data');
    refetch();
  }, [refetch]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    console.log('🔄 Employees: Manual refresh triggered');
    setIsRefreshing(true);
    
    try {
      await modernRefresh(
        employees,
        async () => {
          const result = await refetch();
          return (result.data || []).map(transformOptimizedUser);
        },
        () => {}, // No need to update state, React Query handles it
        { showToast: true }
      );
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

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
            <Button onClick={handleAddEmployee}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter Employé
            </Button>
          )}
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            variant="outline"
            size="icon"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
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
        onRefresh={handleRefresh}
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

export default EmployeesContainer;

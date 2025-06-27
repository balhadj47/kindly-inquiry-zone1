
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
const transformOptimizedUser = (user: any): User => {
  if (!user || typeof user !== 'object') {
    console.warn('Invalid user data for transformation:', user);
    return null;
  }

  try {
    return {
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || null,
      role_id: user.role_id || 3,
      status: user.status || 'active',
      createdAt: user.created_at || new Date().toISOString(),
      totalTrips: user.total_trips || 0,
      lastTrip: user.last_trip || null,
      profileImage: user.profile_image || null,
      badgeNumber: user.badge_number || null,
      dateOfBirth: user.date_of_birth || null,
      placeOfBirth: user.place_of_birth || null,
      address: user.address || null,
      driverLicense: user.driver_license || null,
    };
  } catch (error) {
    console.error('Error transforming user data:', error, user);
    return null;
  }
};

const EmployeesContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use the optimized hook for employees (role_id: 3)
  const { data: rawEmployees = [], isLoading: loading, refetch, error } = useUsersByRoleId(3);
  const { invalidateCompanies } = useModernRefresh<User>();

  // Transform the raw employees data to match RBAC User type with proper error handling
  const employees: User[] = React.useMemo(() => {
    try {
      if (!Array.isArray(rawEmployees)) {
        console.warn('Raw employees data is not an array:', rawEmployees);
        return [];
      }

      return rawEmployees
        .map(transformOptimizedUser)
        .filter(employee => employee !== null); // Filter out any failed transformations
    } catch (error) {
      console.error('Error processing employees data:', error);
      return [];
    }
  }, [rawEmployees]);

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
    try {
      refetch();
    } catch (error) {
      console.error('Error during initial refresh:', error);
    }
  }, [refetch]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    console.log('🔄 Employees: Manual refresh triggered');
    setIsRefreshing(true);
    
    try {
      await refetch();
    } catch (error) {
      console.error('Error during manual refresh:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  // Handle error state
  if (error) {
    console.error('Employees fetch error:', error);
    return (
      <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
        <div className="flex items-center justify-between">
          <EmployeesHeader employeesCount={0} />
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleRefresh} 
              disabled={isRefreshing}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">Impossible de charger les employés</p>
          <Button onClick={handleRefresh}>Réessayer</Button>
        </div>
      </div>
    );
  }

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
            <Button 
              onClick={handleAddEmployee}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          )}
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
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

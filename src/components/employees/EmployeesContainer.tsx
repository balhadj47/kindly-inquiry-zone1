import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import EmployeesHeader from './EmployeesHeader';
import EmployeesFilters from './EmployeesFilters';
import EmployeesList from './EmployeesList';
import EmployeeModal from './EmployeeModal';
import EmployeeDeleteDialog from './EmployeeDeleteDialog';
import { useUsersByRoleId } from '@/hooks/useUsersOptimized';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { useEmployeePermissions } from '@/hooks/useEmployeePermissions';
import { useProcessedEmployees } from './EmployeesDataTransformer';
import { usePermissions } from '@/hooks/usePermissions';

const EmployeesContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use the optimized hook for employees (role_id: 3) with error handling
  const { data: rawEmployees, isLoading: loading, refetch, error } = useUsersByRoleId(3);

  // Enhanced data processing with comprehensive error handling
  const employees = useProcessedEmployees(rawEmployees);

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
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,
    hasUsersReadPermission,
  } = useEmployeePermissions();

  const permissions = usePermissions();

  // Enhanced component mount effect with error handling
  useEffect(() => {
    const initializeEmployees = async () => {
      try {
        console.log('👥 Employees: Component mounted, initializing data');
        await refetch();
        console.log('✅ Employees: Initial data fetch completed');
      } catch (error) {
        console.error('❌ Employees: Error during initial data fetch:', error);
      }
    };

    initializeEmployees();
  }, [refetch]);

  const handleRefresh = async () => {
    if (isRefreshing) {
      console.log('🔄 Employees: Refresh already in progress');
      return;
    }
    
    console.log('🔄 Employees: Manual refresh triggered');
    setIsRefreshing(true);
    
    try {
      await refetch();
      console.log('✅ Employees: Manual refresh completed');
    } catch (error) {
      console.error('❌ Employees: Error during manual refresh:', error);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        console.log('🔄 Employees: Refresh state reset');
      }, 500);
    }
  };

  const clearFilters = () => {
    try {
      setSearchTerm('');
      setStatusFilter('all');
      console.log('🧹 Employees: Filters cleared');
    } catch (error) {
      console.error('❌ Employees: Error clearing filters:', error);
    }
  };

  // Enhanced error state handling
  if (error) {
    console.error('❌ Employees: Fetch error:', error);
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
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? 'Chargement...' : 'Réessayer'}
          </Button>
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

  if (!permissions.isAuthenticated) {
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

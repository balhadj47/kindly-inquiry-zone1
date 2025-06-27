
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
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { useEmployeePermissions } from '@/hooks/useEmployeePermissions';

// Enhanced user data transformer with comprehensive error handling
const transformOptimizedUser = (user: any): User | null => {
  try {
    if (!user) {
      console.warn('⚠️ Employees: Null user data for transformation');
      return null;
    }

    if (typeof user !== 'object') {
      console.warn('⚠️ Employees: Invalid user data type for transformation:', typeof user);
      return null;
    }

    // Validate required fields
    if (!user.id) {
      console.warn('⚠️ Employees: User missing required ID field:', user);
      return null;
    }

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
    console.error('❌ Employees: Error transforming user data:', error, user);
    return null;
  }
};

const EmployeesContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use the optimized hook for employees (role_id: 3) with error handling
  const { data: rawEmployees, isLoading: loading, refetch, error } = useUsersByRoleId(3);

  // Enhanced data processing with comprehensive error handling
  const employees: User[] = React.useMemo(() => {
    try {
      console.log('👥 Employees: Processing raw employees data:', {
        rawEmployeesType: typeof rawEmployees,
        isArray: Array.isArray(rawEmployees),
        length: Array.isArray(rawEmployees) ? rawEmployees.length : 'N/A',
        sample: Array.isArray(rawEmployees) ? rawEmployees[0] : rawEmployees
      });

      if (!rawEmployees) {
        console.warn('⚠️ Employees: Raw employees data is null/undefined');
        return [];
      }

      if (!Array.isArray(rawEmployees)) {
        console.warn('⚠️ Employees: Raw employees data is not an array:', typeof rawEmployees, rawEmployees);
        return [];
      }

      const processed = rawEmployees
        .map((user, index) => {
          try {
            return transformOptimizedUser(user);
          } catch (transformError) {
            console.error(`❌ Employees: Error transforming user at index ${index}:`, transformError, user);
            return null;
          }
        })
        .filter((employee): employee is User => {
          if (employee === null) {
            return false;
          }
          return true;
        });

      console.log('✅ Employees: Successfully processed employees:', {
        originalCount: rawEmployees.length,
        processedCount: processed.length,
        filtered: processed.length !== rawEmployees.length
      });

      return processed;
    } catch (error) {
      console.error('❌ Employees: Critical error processing employees data:', error);
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

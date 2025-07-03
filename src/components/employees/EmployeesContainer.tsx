
import React from 'react';
import { useUsersByRoleId } from '@/hooks/users';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { useEmployeePermissions } from '@/hooks/useEmployeePermissions';
import EmployeesHeader from './EmployeesHeader';
import EmployeesActions from './EmployeesActions';
import EmployeesListOptimized from './EmployeesListOptimized';
import EmployeesFilters from './EmployeesFilters';
import UserDialog from '../user-dialog/UserDialog';
import EmployeeDeleteDialog from './EmployeeDeleteDialog';
import EmployeesEnhancedSkeleton from './EmployeesEnhancedSkeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useState, useMemo } from 'react';
import { User } from '@/types/rbac';
import { useCacheRefresh } from '@/hooks/useCacheRefresh';

const EmployeesContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { refreshPage } = useCacheRefresh();
  
  const { data: employeesData = [], refetch, error, isLoading } = useUsersByRoleId(3);
  const permissions = useEmployeePermissions();

  // Simplified memoization to avoid hook count issues
  const employees: User[] = useMemo(() => {
    if (!employeesData || !Array.isArray(employeesData)) {
      return [];
    }

    return employeesData.map(emp => {
      // Parse driver_license_category_dates safely
      let parsedCategoryDates = {};
      try {
        if (emp.driver_license_category_dates) {
          if (typeof emp.driver_license_category_dates === 'object' && 
              emp.driver_license_category_dates !== null &&
              !Array.isArray(emp.driver_license_category_dates)) {
            parsedCategoryDates = emp.driver_license_category_dates as Record<string, { start?: string; expiry?: string }>;
          } else if (typeof emp.driver_license_category_dates === 'string') {
            const parsed = JSON.parse(emp.driver_license_category_dates);
            if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
              parsedCategoryDates = parsed as Record<string, { start?: string; expiry?: string }>;
            }
          }
        }
      } catch (error) {
        console.warn('Failed to parse driver_license_category_dates:', error);
        parsedCategoryDates = {};
      }

      return {
        id: emp.id?.toString() || '',
        name: emp.name || '',
        email: emp.email || '',
        phone: emp.phone || '',
        role_id: emp.role_id || 3,
        status: emp.status as User['status'],
        createdAt: emp.created_at || new Date().toISOString(),
        badgeNumber: emp.badge_number,
        dateOfBirth: emp.date_of_birth,
        placeOfBirth: emp.place_of_birth,
        address: emp.address,
        driverLicense: emp.driver_license,
        totalTrips: emp.total_trips,
        lastTrip: emp.last_trip,
        profileImage: emp.profile_image,
        identification_national: emp.identification_national,
        carte_national: emp.carte_national,
        carte_national_start_date: emp.carte_national_start_date,
        carte_national_expiry_date: emp.carte_national_expiry_date,
        driver_license_start_date: emp.driver_license_start_date,
        driver_license_expiry_date: emp.driver_license_expiry_date,
        driver_license_category: emp.driver_license_category,
        driver_license_category_dates: parsedCategoryDates,
        blood_type: emp.blood_type,
        company_assignment_date: emp.company_assignment_date,
      };
    });
  }, [employeesData]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = !searchTerm || 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.badgeNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [employees, searchTerm, statusFilter]);

  // Enhanced refresh function that forces cache invalidation
  const handleRefresh = async () => {
    await refreshPage(['users', 'role_id', '3']);
    await refetch();
  };

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
  } = useEmployeeActions(handleRefresh);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  if (isLoading) {
    return <EmployeesEnhancedSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-destructive/10 rounded-full p-6 w-fit mx-auto">
            <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
              <span className="text-destructive text-2xl">⚠️</span>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-destructive">Erreur de chargement</h2>
            <p className="text-muted-foreground">Impossible de charger les employés. Veuillez réessayer.</p>
          </div>
          <button 
            onClick={handleRefresh} 
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!permissions.hasUsersReadPermission) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-warning/10 rounded-full p-6 w-fit mx-auto">
            <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center">
              <span className="text-warning text-2xl">🔒</span>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Accès non autorisé</h2>
            <p className="text-muted-foreground">Vous n'avez pas les permissions nécessaires pour accéder à la gestion des employés.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-full overflow-hidden p-1">
      {/* Header section with enhanced spacing */}
      <div className="flex items-center justify-between mb-2">
        <EmployeesHeader employeesCount={employees.length} />
        <EmployeesActions 
          onCreateEmployee={handleAddEmployee}
          onRefresh={handleRefresh}
          canCreateEmployees={permissions.canCreateUsers}
        />
      </div>

      {/* Filters section with enhanced visual hierarchy */}
      <Card className="shadow-sm border-border/20">
        <CardContent className="p-8">
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

      {/* Main content with better spacing */}
      <div className="mt-8">
        <EmployeesListOptimized
          employees={filteredEmployees}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onEditEmployee={handleEditEmployee}
          onDeleteEmployee={handleDeleteEmployee}
          canEdit={permissions.canEditUsers}
          canDelete={permissions.canDeleteUsers}
        />
      </div>

      <UserDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedEmployee}
        userType="employee"
        onRefresh={handleRefresh}
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

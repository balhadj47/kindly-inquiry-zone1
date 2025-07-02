
import React from 'react';
import { useUsersByRoleId } from '@/hooks/useUsersOptimized';
import { useEmployeeActions } from '@/hooks/useEmployeeActions';
import { useEmployeePermissions } from '@/hooks/useEmployeePermissions';
import EmployeesHeader from './EmployeesHeader';
import EmployeesActions from './EmployeesActions';
import EmployeesList from './EmployeesList';
import EmployeesFilters from './EmployeesFilters';
import UserDialog from '../user-dialog/UserDialog';
import EmployeeDeleteDialog from './EmployeeDeleteDialog';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { User } from '@/types/rbac';
import { useCacheRefresh } from '@/hooks/useCacheRefresh';

const EmployeesContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { refreshPage } = useCacheRefresh();
  
  console.log('🏢 EmployeesContainer: Starting to fetch employees data');
  
  const { data: employeesData = [], refetch, error } = useUsersByRoleId(3);
  
  console.log('🏢 EmployeesContainer: Raw employees data:', {
    data: employeesData,
    dataType: typeof employeesData,
    isArray: Array.isArray(employeesData),
    length: employeesData?.length || 0,
    error: error
  });

  // Transform the data to match User interface - Include ALL fields
  const employees: User[] = employeesData.map(emp => {
    console.log('🔄 EmployeesContainer: Transforming employee:', emp);
    
    const transformedEmployee = {
      ...emp,
      id: emp.id?.toString() || '',
      createdAt: emp.created_at || new Date().toISOString(),
      status: emp.status as User['status'],
      badgeNumber: emp.badge_number,
      dateOfBirth: emp.date_of_birth,
      placeOfBirth: emp.place_of_birth,
      driverLicense: emp.driver_license,
      totalTrips: emp.total_trips,
      lastTrip: emp.last_trip,
      profileImage: emp.profile_image,
      // Add ALL the new fields
      identification_national: emp.identification_national,
      carte_national: emp.carte_national,
      carte_national_start_date: emp.carte_national_start_date,
      carte_national_expiry_date: emp.carte_national_expiry_date,
      driver_license_start_date: emp.driver_license_start_date,
      driver_license_expiry_date: emp.driver_license_expiry_date,
      driver_license_category: emp.driver_license_category,
      driver_license_category_dates: emp.driver_license_category_dates,
      blood_type: emp.blood_type,
      company_assignment_date: emp.company_assignment_date,
    };
    
    console.log('✅ EmployeesContainer: Transformed employee with all fields:', transformedEmployee);
    return transformedEmployee;
  });
  
  const permissions = useEmployeePermissions();
  
  console.log('🔒 EmployeesContainer: Permissions:', permissions);

  // Enhanced refresh function that forces cache invalidation
  const handleRefresh = async () => {
    console.log('🔄 EmployeesContainer: Manual refresh triggered');
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

  console.log('🏢 EmployeesContainer: Final state:', {
    employeesCount: employees.length,
    searchTerm,
    statusFilter,
    isModalOpen,
    selectedEmployee: selectedEmployee?.id || 'none'
  });

  if (error) {
    console.error('❌ EmployeesContainer: Error fetching employees:', error);
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2 text-red-600">Erreur de chargement</h2>
        <p className="text-gray-600">Impossible de charger les employés. Veuillez réessayer.</p>
        <button 
          onClick={handleRefresh} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!permissions.hasUsersReadPermission) {
    console.warn('⚠️ EmployeesContainer: User lacks read permissions');
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Accès non autorisé</h2>
        <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à la gestion des employés.</p>
      </div>
    );
  }

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = !searchTerm || 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.badgeNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  console.log('🔍 EmployeesContainer: Filtered employees:', {
    total: employees.length,
    filtered: filteredEmployees.length,
    searchTerm,
    statusFilter
  });

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <EmployeesHeader employeesCount={employees.length} />
        <EmployeesActions 
          onCreateEmployee={handleAddEmployee}
          onRefresh={handleRefresh}
          canCreateEmployees={permissions.canCreateUsers}
        />
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
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

      <EmployeesList
        employees={filteredEmployees}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onEditEmployee={handleEditEmployee}
        onDeleteEmployee={handleDeleteEmployee}
        canEdit={permissions.canEditUsers}
        canDelete={permissions.canDeleteUsers}
      />

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

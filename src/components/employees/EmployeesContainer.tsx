
import React from 'react';
import { useUsersByRoleId } from '@/hooks/users';
import { useEmployeesState } from './state/EmployeesState';
import { useEmployeeDataProcessor } from './data/EmployeeDataProcessor';
import { useEmployeeFiltering } from './data/EmployeeFiltering';
import EmployeesLayout from './layout/EmployeesLayout';
import EmployeesListOptimized from './EmployeesListOptimized';
import UserDialog from '../user-dialog/UserDialog';
import EmployeeDeleteDialog from './EmployeeDeleteDialog';
import EmployeesEnhancedSkeleton from './EmployeesEnhancedSkeleton';

const EmployeesContainerOptimized = () => {
  const { data: rawEmployeesData, refetch, error, isLoading } = useUsersByRoleId(3);
  
  const employeesState = useEmployeesState(refetch);
  const { employees } = useEmployeeDataProcessor(rawEmployeesData || []);
  const { filteredEmployees } = useEmployeeFiltering(
    employees, 
    employeesState.searchTerm, 
    employeesState.statusFilter
  );

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
            onClick={employeesState.handleRefresh} 
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!employeesState.permissions.hasUsersReadPermission) {
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
    <>
      {/* Dialogs placed at the top for better code organization */}
      <UserDialog
        isOpen={employeesState.isModalOpen}
        onClose={() => employeesState.setIsModalOpen(false)}
        user={employeesState.selectedEmployee}
        userType="employee"
        onRefresh={employeesState.handleRefresh}
      />

      <EmployeeDeleteDialog
        isOpen={employeesState.isDeleteDialogOpen}
        onCancel={employeesState.handleCancelDelete}
        employee={employeesState.selectedEmployee}
        onConfirm={employeesState.handleConfirmDelete}
      />

      {/* Main content */}
      <EmployeesLayout
        employeesCount={employees.length}
        canCreateEmployees={employeesState.permissions.canCreateUsers}
        onCreateEmployee={employeesState.handleAddEmployee}
        onRefresh={employeesState.handleRefresh}
        searchTerm={employeesState.searchTerm}
        setSearchTerm={employeesState.setSearchTerm}
        statusFilter={employeesState.statusFilter}
        setStatusFilter={employeesState.setStatusFilter}
        clearFilters={employeesState.clearFilters}
        employees={employees}
      >
        <EmployeesListOptimized
          employees={filteredEmployees}
          searchTerm={employeesState.searchTerm}
          statusFilter={employeesState.statusFilter}
          onEditEmployee={employeesState.handleEditEmployee}
          onDeleteEmployee={employeesState.handleDeleteEmployee}
          canEdit={employeesState.permissions.canEditUsers}
          canDelete={employeesState.permissions.canDeleteUsers}
        />
      </EmployeesLayout>
    </>
  );
};

export default EmployeesContainerOptimized;

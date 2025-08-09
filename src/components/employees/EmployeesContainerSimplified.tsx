
import React, { useState } from 'react';
import { useUsersByRoleId } from '@/hooks/users';
import { useEmployeeDataProcessor } from './data/EmployeeDataProcessor';
import { useEmployeeFiltering } from './data/EmployeeFiltering';
import { useEmployeePermissions } from '@/hooks/useEmployeePermissions';
import { useCacheRefresh } from '@/hooks/useCacheRefresh';
import { useRBAC } from '@/contexts/RBACContext';
import { useToast } from '@/hooks/use-toast';
import { useUserMutations } from '@/hooks/users';
import { User } from '@/types/rbac';
import EmployeesLayout from './layout/EmployeesLayout';
import EmployeesListOptimized from './EmployeesListOptimized';
import EmployeeModal from './EmployeeModal';
import EmployeeDeleteDialog from './EmployeeDeleteDialog';
import EmployeesEnhancedSkeleton from './EmployeesEnhancedSkeleton';

const EmployeesContainerSimplified = () => {
  // Data fetching
  const { data: rawEmployeesData, refetch, error, isLoading } = useUsersByRoleId(3);
  const { refreshPage } = useCacheRefresh();
  const { toast } = useToast();
  const { deleteUser } = useUserMutations();
  
  // Local state - consolidated in one place
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  
  // Data processing
  const { employees } = useEmployeeDataProcessor(rawEmployeesData || []);
  const { filteredEmployees } = useEmployeeFiltering(employees, searchTerm, statusFilter);
  const permissions = useEmployeePermissions();

  // Enhanced refresh function
  const handleRefresh = async () => {
    console.log('🔄 EmployeesContainer: Manual refresh triggered');
    await refreshPage(['users', 'role_id', '3']);
    await refetch();
  };

  // Employee actions - all consolidated here
  const handleAddEmployee = () => {
    console.log('🆕 EmployeesContainer: Adding new employee');
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: User) => {
    console.log('✏️ EmployeesContainer: Editing employee:', employee.id, employee.name);
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = (employee: User) => {
    console.log('🗑️ EmployeesContainer: Preparing to delete employee:', employee.id, employee.name);
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) {
      console.error('❌ EmployeesContainer: No employee selected for deletion');
      return;
    }
    
    try {
      console.log('🗑️ EmployeesContainer: Confirming deletion of employee:', selectedEmployee.id, selectedEmployee.name);
      await deleteUser.mutateAsync(selectedEmployee.id);
      
      console.log('✅ EmployeesContainer: Employee deleted successfully:', selectedEmployee.id);
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
      
      toast({
        title: 'Succès',
        description: `Employé ${selectedEmployee.name} supprimé avec succès`,
      });
      
      handleRefresh();
      
    } catch (error) {
      console.error('❌ EmployeesContainer: Error deleting employee:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'employé. Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelDelete = () => {
    console.log('❌ EmployeesContainer: Canceling employee deletion');
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
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
    <>
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        employee={selectedEmployee}
        onRefresh={handleRefresh}
      />

      <EmployeeDeleteDialog
        isOpen={isDeleteDialogOpen}
        onCancel={handleCancelDelete}
        employee={selectedEmployee}
        onConfirm={handleConfirmDelete}
      />

      <EmployeesLayout
        employeesCount={employees.length}
        canCreateEmployees={permissions.canCreateUsers}
        onCreateEmployee={handleAddEmployee}
        onRefresh={handleRefresh}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        clearFilters={clearFilters}
        employees={employees}
      >
        <EmployeesListOptimized
          employees={filteredEmployees}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onEditEmployee={handleEditEmployee}
          onDeleteEmployee={handleDeleteEmployee}
          canEdit={permissions.canEditUsers}
          canDelete={permissions.canDeleteUsers}
        />
      </EmployeesLayout>
    </>
  );
};

export default EmployeesContainerSimplified;

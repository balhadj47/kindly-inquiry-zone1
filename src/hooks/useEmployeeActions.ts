
import { useState } from 'react';
import { User } from '@/types/rbac';
import { useToast } from '@/hooks/use-toast';
import { useUserMutations } from '@/hooks/useUsersOptimized';

export const useEmployeeActions = (refetch: () => void) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  
  const { toast } = useToast();
  const { deleteUser } = useUserMutations();

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

  return {
    isModalOpen,
    setIsModalOpen,
    isDeleteDialogOpen,
    selectedEmployee,
    handleAddEmployee,
    handleEditEmployee,
    handleDeleteEmployee,
    handleConfirmDelete,
    handleCancelDelete,
  };
};

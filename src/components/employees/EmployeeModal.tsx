
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User } from '@/types/rbac';
import { useRBAC } from '@/contexts/RBACContext';
import { useToast } from '@/hooks/use-toast';
import { useCacheRefresh } from '@/hooks/useCacheRefresh';
import EmployeeModalForm from './EmployeeModalForm';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: User | null;
  onRefresh?: () => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, employee, onRefresh }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addUser, updateUser } = useRBAC();
  const { toast } = useToast();
  const { refreshPage } = useCacheRefresh();

  const handleSubmit = async (userData: Partial<User>) => {
    setIsSubmitting(true);
    try {
      console.log('🔍 EmployeeModal - Received data from form:', userData);
      console.log('🖼️ EmployeeModal - ProfileImage value:', JSON.stringify(userData.profileImage));
      
      // Ensure role_id is 3 for employees
      const employeeData = { 
        ...userData, 
        role_id: 3
      };
      
      console.log('🚀 EmployeeModal - Final employee data to save:', employeeData);
      
      if (employee) {
        console.log('📝 EmployeeModal - Updating employee:', employee.id);
        await updateUser(employee.id, employeeData);
        toast({
          title: 'Succès',
          description: 'Employé modifié avec succès',
        });
      } else {
        console.log('➕ EmployeeModal - Creating new employee');
        await addUser(employeeData);
        toast({
          title: 'Succès',
          description: 'Employé créé avec succès',
        });
      }
      
      // Force refresh the specific employee query cache
      console.log('🔄 EmployeeModal - Force refreshing employee cache');
      await refreshPage(['users', 'role_id', '3']);
      
      // Also call the parent refresh callback
      if (onRefresh) {
        console.log('🔄 EmployeeModal - Calling parent onRefresh');
        onRefresh();
      }
      
      onClose();
    } catch (error) {
      console.error('❌ EmployeeModal - Error submitting employee:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[700px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg sm:text-xl">
            {employee ? 'Modifier l\'Employé' : 'Ajouter un Nouvel Employé'}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {employee 
              ? 'Modifiez les informations de l\'employé ci-dessous.' 
              : 'Remplissez les informations pour créer un nouvel employé.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <EmployeeModalForm
          employee={employee}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeModal;

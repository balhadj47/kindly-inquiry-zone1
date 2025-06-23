
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User } from '@/types/rbac';
import { useRBAC } from '@/contexts/RBACContext';
import { useToast } from '@/hooks/use-toast';
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

  const handleSubmit = async (userData: Partial<User>) => {
    setIsSubmitting(true);
    try {
      console.log('EmployeeModal - Submitting employee data:', userData);
      
      // Ensure role_id is 3 for employees - remove group_id references
      const employeeData = { 
        ...userData, 
        role_id: 3
      };
      
      console.log('EmployeeModal - Final employee data:', employeeData);
      
      if (employee) {
        await updateUser(employee.id, employeeData);
        toast({
          title: 'Succès',
          description: 'Employé modifié avec succès',
        });
      } else {
        await addUser(employeeData);
        toast({
          title: 'Succès',
          description: 'Employé créé avec succès',
        });
      }
      
      // Refresh the employees list after successful operation
      if (onRefresh) {
        onRefresh();
      }
      
      onClose();
    } catch (error) {
      console.error('Error submitting employee:', error);
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {employee ? 'Modifier l\'Employé' : 'Ajouter un Nouvel Employé'}
          </DialogTitle>
          <DialogDescription>
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

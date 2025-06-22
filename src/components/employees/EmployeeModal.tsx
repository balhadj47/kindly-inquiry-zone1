
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
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, employee }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addUser, updateUser } = useRBAC();
  const { toast } = useToast();

  const handleSubmit = async (userData: Partial<User>) => {
    setIsSubmitting(true);
    try {
      // Ensure role_id is 4 for employees
      const employeeData = { ...userData, role_id: 4 };
      
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

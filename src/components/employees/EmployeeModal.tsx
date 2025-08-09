
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User } from '@/types/rbac';
import { useRBAC } from '@/contexts/RBACContext';
import { useToast } from '@/hooks/use-toast';
import { useCacheRefresh } from '@/hooks/useCacheRefresh';
import EmployeeForm from './EmployeeForm';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: User | null;
  onRefresh?: () => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ isOpen, onClose, employee, onRefresh }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { addUser, updateUser } = useRBAC();
  const { toast } = useToast();
  const { refreshPage } = useCacheRefresh();

  const handleSubmit = async (userData: Partial<User>) => {
    setIsSubmitting(true);
    setSubmitError(null); // Clear previous errors
    
    try {
      console.log('🔍 EmployeeModal - Received data from form:', userData);
      
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
      
      // Only close on success
      onClose();
      
    } catch (error) {
      console.error('❌ EmployeeModal - Error submitting employee:', error);
      
      // Set error state but don't close modal or reset form
      if (error instanceof Error) {
        if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
          if (error.message.includes('email')) {
            setSubmitError('Cette adresse email est déjà utilisée par un autre utilisateur. Veuillez utiliser une adresse email différente.');
          } else {
            setSubmitError('Cette valeur est déjà utilisée. Veuillez en choisir une autre.');
          }
        } else if (error.message.includes('permission')) {
          setSubmitError('Vous n\'avez pas les permissions nécessaires pour effectuer cette action.');
        } else if (error.message.includes('violates row-level security')) {
          setSubmitError('Erreur de sécurité lors de l\'enregistrement. Vérifiez vos permissions.');
        } else {
          setSubmitError(`Erreur: ${error.message}`);
        }
      } else {
        setSubmitError('Une erreur inattendue s\'est produite. Veuillez réessayer.');
      }
      
      // Don't show toast here as we're showing error in form
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitError(null); // Clear errors when closing
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
        
        <EmployeeForm
          employee={employee}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={handleClose}
          submitError={submitError}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeModal;

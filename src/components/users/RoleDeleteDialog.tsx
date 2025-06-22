
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRBAC } from '@/contexts/RBACContext';
import { SystemGroup } from '@/types/systemGroups';

interface RoleDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  role: SystemGroup | null;
}

const RoleDeleteDialog: React.FC<RoleDeleteDialogProps> = ({ isOpen, onClose, role }) => {
  const { deleteRole } = useRBAC();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!role) return;
    
    setLoading(true);
    try {
      await deleteRole(role.id);
      onClose();
    } catch (error) {
      console.error('Error deleting system group:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer le Groupe Système</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer le groupe système "{role?.name}" ?
            Cette action est irréversible et peut affecter les utilisateurs assignés à ce groupe.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Suppression...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RoleDeleteDialog;

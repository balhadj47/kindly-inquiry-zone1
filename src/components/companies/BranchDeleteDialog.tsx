
import React from 'react';
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
import { useLanguage } from '@/contexts/LanguageContext';
import { Branch } from '@/hooks/useCompanies';

interface BranchDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  branch: Branch | null;
  onConfirm: () => void;
  isLoading: boolean;
}

const BranchDeleteDialog = ({ isOpen, onClose, branch, onConfirm, isLoading }: BranchDeleteDialogProps) => {
  const { t } = useLanguage();

  if (!branch) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.deleteBranch}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.deleteBranchConfirmation} "{branch.name}"? {t.actionCannotBeUndone}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{t.cancel}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? t.deleting : t.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BranchDeleteDialog;


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
import { Company } from '@/hooks/useCompanies';

interface CompanyDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

const CompanyDeleteDialog = ({ 
  isOpen, 
  onClose, 
  company, 
  onConfirm, 
  isLoading = false 
}: CompanyDeleteDialogProps) => {
  const { t } = useLanguage();

  if (!company) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.confirmDeletion}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.areYouSureDelete} "{company.name}" ? 
            {t.thisWillAlsoDelete} ({company.branches.length} {company.branches.length !== 1 ? t.branches : t.branch}).
            <br /><br />
            <strong>{t.thisActionIsIrreversible}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t.cancel}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? t.deleting : t.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CompanyDeleteDialog;

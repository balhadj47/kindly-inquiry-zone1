
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
  isLoading: boolean;
}

const CompanyDeleteDialog = ({ 
  isOpen, 
  onClose, 
  company, 
  onConfirm, 
  isLoading 
}: CompanyDeleteDialogProps) => {
  const { t } = useLanguage();

  if (!company) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer l'entreprise "{company.name}" ? 
            Cette action supprimera également toutes les succursales associées ({company.branches.length} succursale{company.branches.length !== 1 ? 's' : ''}).
            <br /><br />
            <strong>Cette action est irréversible.</strong>
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
            {isLoading ? 'Suppression...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CompanyDeleteDialog;


import { useState } from 'react';
import { Company } from '@/hooks/useCompanies';
import { useCompaniesActions } from '@/hooks/useCompaniesActions';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export const useCompaniesState = (setCompanies: (updater: (prev: Company[]) => Company[]) => void) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const { deleteCompany, isLoading: isDeleting } = useCompaniesActions();
  const { t } = useLanguage();

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsModalOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleDeleteCompany = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCompany) return;

    try {
      await deleteCompany(selectedCompany.id);
      
      // Update local state by removing the deleted company
      setCompanies(prevCompanies => 
        prevCompanies.filter(company => company.id !== selectedCompany.id)
      );
      
      toast.success(t.companyDeletedSuccessfully);
      setIsDeleteDialogOpen(false);
      setSelectedCompany(null);
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Erreur lors de la suppression de l\'entreprise');
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedCompany,
    isDeleting,
    handleAddCompany,
    handleEditCompany,
    handleDeleteCompany,
    handleConfirmDelete
  };
};

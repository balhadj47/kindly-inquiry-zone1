
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { TripWizardStep } from '@/hooks/useTripWizard';

export const useTripFormValidation = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const validateForm = useCallback((formData: any) => {
    // Check van selection
    if (!formData.vanId) {
      toast({
        title: t.error,
        description: "Veuillez sélectionner une camionnette",
        variant: "destructive",
      });
      return false;
    }

    // Check start kilometers
    if (!formData.startKm || parseInt(formData.startKm) < 0) {
      toast({
        title: t.error,
        description: "Veuillez entrer un kilométrage de départ valide",
        variant: "destructive",
      });
      return false;
    }

    // Check company selection (must have at least one)
    if (!formData.selectedCompanies || formData.selectedCompanies.length === 0) {
      toast({
        title: t.error,
        description: "Veuillez sélectionner au moins une entreprise",
        variant: "destructive",
      });
      return false;
    }

    // Check that all selected companies have branches
    for (const company of formData.selectedCompanies) {
      if (!company.branchId) {
        toast({
          title: t.error,
          description: `Veuillez sélectionner une succursale pour ${company.companyName}`,
          variant: "destructive",
        });
        return false;
      }
    }

    // Check team selection
    if (!formData.selectedUsersWithRoles || formData.selectedUsersWithRoles.length === 0) {
      toast({
        title: t.error,
        description: "Veuillez sélectionner au moins un membre d'équipe",
        variant: "destructive",
      });
      return false;
    }

    // Validate that each user has roles assigned
    for (const userRole of formData.selectedUsersWithRoles) {
      if (!userRole.roles || userRole.roles.length === 0) {
        toast({
          title: t.error,
          description: "Chaque membre d'équipe doit avoir au moins un rôle assigné",
          variant: "destructive",
        });
        return false;
      }
    }

    // Validate that both dates are provided
    if (!formData.startDate || !formData.endDate) {
      toast({
        title: t.error,
        description: "Les dates de début et de fin sont obligatoires",
        variant: "destructive",
      });
      return false;
    }

    // Validate date logic
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (startDate >= endDate) {
      toast({
        title: t.error,
        description: "La date de fin doit être après la date de début",
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [toast, t]);

  const validateCurrentStep = useCallback((currentStep: TripWizardStep, formData: any) => {
    switch (currentStep) {
      case 'van':
        if (!formData.vanId) {
          toast({
            title: t.error,
            description: "Veuillez sélectionner une camionnette",
            variant: "destructive",
          });
          return false;
        }
        if (!formData.startKm || parseInt(formData.startKm) < 0) {
          toast({
            title: t.error,
            description: "Veuillez entrer un kilométrage de départ valide",
            variant: "destructive",
          });
          return false;
        }
        return true;
        
      case 'company':
        if (!formData.selectedCompanies || formData.selectedCompanies.length === 0) {
          toast({
            title: t.error,
            description: "Veuillez sélectionner au moins une entreprise",
            variant: "destructive",
          });
          return false;
        }
        // Check that all selected companies have branches
        for (const company of formData.selectedCompanies) {
          if (!company.branchId) {
            toast({
              title: t.error,
              description: `Veuillez sélectionner une succursale pour ${company.companyName}`,
              variant: "destructive",
            });
            return false;
          }
        }
        return true;
        
      case 'team':
        if (!formData.selectedUsersWithRoles || formData.selectedUsersWithRoles.length === 0) {
          toast({
            title: t.error,
            description: "Veuillez sélectionner au moins un membre d'équipe",
            variant: "destructive",
          });
          return false;
        }
        // Validate that each user has roles assigned
        for (const userRole of formData.selectedUsersWithRoles) {
          if (!userRole.roles || userRole.roles.length === 0) {
            toast({
              title: t.error,
              description: "Chaque membre d'équipe doit avoir au moins un rôle assigné",
              variant: "destructive",
            });
            return false;
          }
        }
        return true;
        
      case 'details':
        // Require both dates
        if (!formData.startDate || !formData.endDate) {
          toast({
            title: t.error,
            description: "Les dates de début et de fin sont obligatoires",
            variant: "destructive",
          });
          return false;
        }
        // Validate date logic
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        
        if (startDate >= endDate) {
          toast({
            title: t.error,
            description: "La date de fin doit être après la date de début",
            variant: "destructive",
          });
          return false;
        }
        return true;
        
      default:
        return false;
    }
  }, [toast, t]);

  return {
    validateForm,
    validateCurrentStep,
  };
};

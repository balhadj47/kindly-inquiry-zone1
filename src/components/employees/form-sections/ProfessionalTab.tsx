
import React from 'react';
import { Control } from 'react-hook-form';
import { FormData } from './FormDataHelpers';

interface ProfessionalTabProps {
  control: Control<FormData>;
  isSubmitting: boolean;
}

const ProfessionalTab: React.FC<ProfessionalTabProps> = ({ control, isSubmitting }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-border/50 pb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          💼 Informations professionnelles
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Informations liées au travail de l'employé
        </p>
      </div>

      <div className="bg-muted/20 rounded-lg p-4 border border-border/30">
        <p className="text-sm text-muted-foreground">
          Les informations professionnelles seront ajoutées prochainement.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalTab;

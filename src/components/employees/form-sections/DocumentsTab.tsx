
import React from 'react';
import { Control } from 'react-hook-form';
import IdentityDocumentsSection from './IdentityDocumentsSection';
import DriverLicenseSection from './DriverLicenseSection';
import { FormData } from './FormDataHelpers';

interface DocumentsTabProps {
  control: Control<FormData>;
  isSubmitting: boolean;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ control, isSubmitting }) => {
  return (
    <div className="space-y-6">
      <IdentityDocumentsSection control={control} isSubmitting={isSubmitting} />
      <DriverLicenseSection control={control} isSubmitting={isSubmitting} />
    </div>
  );
};

export default DocumentsTab;

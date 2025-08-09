
import React from 'react';
import { Control } from 'react-hook-form';
import BasicInfoSection from './BasicInfoSection';
import MedicalInfoSection from './MedicalInfoSection';
import { FormData } from './FormDataHelpers';

interface PersonalInfoTabProps {
  control: Control<FormData>;
  isSubmitting: boolean;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({ control, isSubmitting }) => {
  return (
    <div className="space-y-6">
      <BasicInfoSection control={control} isSubmitting={isSubmitting} />
      <MedicalInfoSection control={control} isSubmitting={isSubmitting} />
    </div>
  );
};

export default PersonalInfoTab;

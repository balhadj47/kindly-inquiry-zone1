
import React from 'react';
import { Control } from 'react-hook-form';
import { SystemGroupName } from '@/types/systemGroups';
import BasicInfoFields from './BasicInfoFields';
import SystemFields from './SystemFields';
import EmployeeFields from './EmployeeFields';

interface UserFormFieldsProps {
  control: Control<any>;
  isSubmitting: boolean;
  watchedRole: SystemGroupName;
  watchedEmail: string;
  onEmailValidationChange: (isValid: boolean) => void;
  userId?: string;
}

const UserFormFields: React.FC<UserFormFieldsProps> = React.memo(({
  control,
  isSubmitting,
  watchedRole,
  watchedEmail,
  onEmailValidationChange,
  userId,
}) => {
  const isEmployee = React.useMemo(() => 
    watchedRole === 'Employee', 
    [watchedRole]
  );

  return (
    <>
      <BasicInfoFields
        control={control}
        isSubmitting={isSubmitting}
        isEmployee={isEmployee}
        watchedEmail={watchedEmail}
        onEmailValidationChange={onEmailValidationChange}
        userId={userId}
      />

      <SystemFields
        control={control}
        isSubmitting={isSubmitting}
      />

      {isEmployee && (
        <EmployeeFields
          control={control}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
});

UserFormFields.displayName = 'UserFormFields';

export default UserFormFields;

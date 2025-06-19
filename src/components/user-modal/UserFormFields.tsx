
import React from 'react';
import { Control } from 'react-hook-form';
import BasicInfoFields from './BasicInfoFields';
import SystemFields from './SystemFields';
import EmployeeFields from './EmployeeFields';

interface UserFormFieldsProps {
  control: Control<any>;
  isSubmitting: boolean;
  watchedRoleId: number;
  watchedEmail: string;
  onEmailValidationChange: (isValid: boolean) => void;
  userId?: string;
}

const UserFormFields: React.FC<UserFormFieldsProps> = React.memo(({
  control,
  isSubmitting,
  watchedRoleId,
  watchedEmail,
  onEmailValidationChange,
  userId,
}) => {
  const isEmployee = React.useMemo(() => 
    watchedRoleId === 3, // Employee role_id is 3
    [watchedRoleId]
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

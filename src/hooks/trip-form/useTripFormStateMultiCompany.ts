
import { useState } from 'react';
import { useTripFormMultiCompany } from '@/hooks/useTripFormMultiCompany';

export const useTripFormStateMultiCompany = () => {
  const { 
    formData, 
    handleInputChange, 
    handleDateChange, 
    handleUserRoleSelection, 
    handleAddCompany,
    handleRemoveCompany,
    resetForm 
  } = useTripFormMultiCompany();
  
  const [userSearchQuery, setUserSearchQuery] = useState('');

  return {
    formData,
    handleInputChange,
    handleDateChange,
    handleUserRoleSelection,
    handleAddCompany,
    handleRemoveCompany,
    resetForm,
    userSearchQuery,
    setUserSearchQuery,
  };
};

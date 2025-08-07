
import { useState, useCallback } from 'react';
import { TripFormData, UserWithRoles } from '@/hooks/useTripForm';
import { CompanyBranchSelection } from '@/types/company-selection';
import { MissionRole } from '@/types/missionRoles';

export const useTripFormState = () => {
  const [formData, setFormData] = useState<TripFormData>({
    vanId: '',
    selectedUsersWithRoles: [],
    selectedCompanies: [],
    notes: '',
    startKm: '',
    startDate: undefined,
    endDate: undefined,
  });

  const [userSearchQuery, setUserSearchQuery] = useState('');

  const handleInputChange = useCallback((field: string, value: string) => {
    console.log('🔄 TripFormState: handleInputChange called with:', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleDateChange = useCallback((field: string, value: Date | undefined) => {
    console.log('🔄 TripFormState: handleDateChange called with:', field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleUserRoleSelection = useCallback((userId: string, roles: MissionRole[]) => {
    console.log('🔄 TripFormState: handleUserRoleSelection called with:', userId, roles);
    setFormData(prev => {
      const existingUserIndex = prev.selectedUsersWithRoles.findIndex(u => u.userId === userId);
      
      if (roles.length === 0) {
        return {
          ...prev,
          selectedUsersWithRoles: prev.selectedUsersWithRoles.filter(u => u.userId !== userId)
        };
      }
      
      if (existingUserIndex >= 0) {
        const updatedUsers = [...prev.selectedUsersWithRoles];
        updatedUsers[existingUserIndex] = { userId, roles };
        return {
          ...prev,
          selectedUsersWithRoles: updatedUsers
        };
      } else {
        return {
          ...prev,
          selectedUsersWithRoles: [...prev.selectedUsersWithRoles, { userId, roles }]
        };
      }
    });
  }, []);

  const handleCompanySelection = useCallback((companies: CompanyBranchSelection[]) => {
    console.log('🔄 TripFormState: handleCompanySelection called with:', companies);
    setFormData(prev => ({ ...prev, selectedCompanies: companies }));
  }, []);

  const resetForm = useCallback(() => {
    console.log('🔄 TripFormState: resetForm called');
    setFormData({
      vanId: '',
      selectedUsersWithRoles: [],
      selectedCompanies: [],
      notes: '',
      startKm: '',
      startDate: undefined,
      endDate: undefined,
    });
  }, []);

  return {
    formData,
    handleInputChange,
    handleDateChange,
    handleUserRoleSelection,
    handleCompanySelection,
    userSearchQuery,
    setUserSearchQuery,
    resetForm,
  };
};

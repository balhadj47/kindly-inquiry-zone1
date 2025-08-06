
import { useState, useCallback } from 'react';
import { MissionRole } from '@/types/missionRoles';

export interface UserWithRoles {
  userId: string;
  roles: MissionRole[];
}

export interface SelectedCompany {
  companyId: string;
  branchId: string;
  companyName?: string;
  branchName?: string;
}

export interface TripFormDataMultiCompany {
  vanId: string;
  selectedUsersWithRoles: UserWithRoles[];
  selectedCompanies: SelectedCompany[];
  notes: string;
  startKm: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export const useTripFormMultiCompany = () => {
  const [formData, setFormData] = useState<TripFormDataMultiCompany>({
    vanId: '',
    selectedUsersWithRoles: [],
    selectedCompanies: [],
    notes: '',
    startKm: '',
    startDate: undefined,
    endDate: undefined,
  });

  const handleInputChange = useCallback((field: keyof Omit<TripFormDataMultiCompany, 'selectedUsersWithRoles' | 'selectedCompanies' | 'startDate' | 'endDate'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleDateChange = useCallback((field: 'startDate' | 'endDate', value: Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleUserRoleSelection = useCallback((userId: string, roles: MissionRole[]) => {
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

  const handleAddCompany = useCallback((companyId: string, branchId: string, companyName?: string, branchName?: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCompanies: [...prev.selectedCompanies, { companyId, branchId, companyName, branchName }]
    }));
  }, []);

  const handleRemoveCompany = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      selectedCompanies: prev.selectedCompanies.filter((_, i) => i !== index)
    }));
  }, []);

  const resetForm = useCallback(() => {
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

  const getTripData = useCallback((driver: string) => ({
    van: formData.vanId,
    driver,
    companies: formData.selectedCompanies,
    notes: formData.notes,
    userIds: formData.selectedUsersWithRoles.map(u => u.userId),
    userRoles: formData.selectedUsersWithRoles,
    startKm: parseInt(formData.startKm) || 0,
    startDate: formData.startDate,
    endDate: formData.endDate,
  }), [formData]);

  return {
    formData,
    handleInputChange,
    handleDateChange,
    handleUserRoleSelection,
    handleAddCompany,
    handleRemoveCompany,
    resetForm,
    getTripData,
  };
};

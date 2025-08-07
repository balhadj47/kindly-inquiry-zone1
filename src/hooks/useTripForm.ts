
import { useState, useCallback } from 'react';
import { MissionRole } from '@/types/missionRoles';
import { CompanyBranchSelection } from '@/types/company-selection';

export interface UserWithRoles {
  userId: string;
  roles: MissionRole[];
}

export interface TripFormData {
  vanId: string;
  selectedUsersWithRoles: UserWithRoles[];
  selectedCompanies: CompanyBranchSelection[];
  notes: string;
  startKm: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export const useTripForm = () => {
  const [formData, setFormData] = useState<TripFormData>({
    vanId: '',
    selectedUsersWithRoles: [],
    selectedCompanies: [],
    notes: '',
    startKm: '',
    startDate: undefined,
    endDate: undefined,
  });

  const handleInputChange = useCallback((field: keyof Omit<TripFormData, 'selectedUsersWithRoles' | 'selectedCompanies' | 'startDate' | 'endDate'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleDateChange = useCallback((field: 'startDate' | 'endDate', value: Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleUserRoleSelection = useCallback((userId: string, roles: MissionRole[]) => {
    setFormData(prev => {
      const existingUserIndex = prev.selectedUsersWithRoles.findIndex(u => u.userId === userId);
      
      if (roles.length === 0) {
        // Remove user if no roles selected
        return {
          ...prev,
          selectedUsersWithRoles: prev.selectedUsersWithRoles.filter(u => u.userId !== userId)
        };
      }
      
      if (existingUserIndex >= 0) {
        // Update existing user's roles
        const updatedUsers = [...prev.selectedUsersWithRoles];
        updatedUsers[existingUserIndex] = { userId, roles };
        return {
          ...prev,
          selectedUsersWithRoles: updatedUsers
        };
      } else {
        // Add new user with roles
        return {
          ...prev,
          selectedUsersWithRoles: [...prev.selectedUsersWithRoles, { userId, roles }]
        };
      }
    });
  }, []);

  const handleCompanySelection = useCallback((companies: CompanyBranchSelection[]) => {
    setFormData(prev => ({ ...prev, selectedCompanies: companies }));
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

  // Helper function to get trip data in the format expected by TripContext
  const getTripData = useCallback((driver: string) => ({
    van: formData.vanId,
    driver,
    // Use first company for legacy compatibility
    company: formData.selectedCompanies[0]?.companyName || '',
    branch: formData.selectedCompanies[0]?.branchName || '',
    notes: formData.notes,
    userIds: formData.selectedUsersWithRoles.map(u => u.userId),
    userRoles: formData.selectedUsersWithRoles,
    startKm: parseInt(formData.startKm) || 0,
    startDate: formData.startDate,
    endDate: formData.endDate,
    selectedCompanies: formData.selectedCompanies,
  }), [formData]);

  return {
    formData,
    handleInputChange,
    handleDateChange,
    handleUserRoleSelection,
    handleCompanySelection,
    resetForm,
    getTripData,
  };
};


import React from 'react';
import { useTripFormContext } from './TripFormProvider';
import VanSelectionStep from './steps/VanSelectionStep';
import CompanySelectionStep from './steps/CompanySelectionStep';
import TeamSelectionStep from './steps/TeamSelectionStep';
import TripDetailsStep from './steps/TripDetailsStep';

export const TripFormSteps: React.FC = () => {
  const {
    currentStep,
    formData,
    handleInputChange,
    handleDateChange,
    handleUserRoleSelection,
    handleCompanySelection,
    userSearchQuery,
    setUserSearchQuery,
    availableVans,
    vans,
    lastKm,
    loadingLastKm,
  } = useTripFormContext();

  // Stable van change handler
  const handleVanChange = React.useCallback((vanId: string) => {
    console.log('🔄 TripFormSteps: Van changed to:', vanId);
    handleInputChange('vanId', vanId);
  }, [handleInputChange]);

  // Stable startKm change handler
  const handleStartKmChange = React.useCallback((value: string) => {
    console.log('🔄 TripFormSteps: handleStartKmChange called with:', value);
    handleInputChange('startKm', value);
  }, [handleInputChange]);

  switch (currentStep) {
    case 'van':
      return (
        <VanSelectionStep
          availableVans={availableVans}
          totalVans={vans}
          selectedVanId={formData.vanId}
          onVanChange={handleVanChange}
          startKm={formData.startKm}
          onStartKmChange={handleStartKmChange}
          lastKm={lastKm}
          loadingLastKm={loadingLastKm}
        />
      );
    case 'company':
      return (
        <CompanySelectionStep
          selectedCompanies={formData.selectedCompanies}
          onCompanySelectionChange={handleCompanySelection}
        />
      );
    case 'team':
      return (
        <TeamSelectionStep
          userSearchQuery={userSearchQuery}
          setUserSearchQuery={setUserSearchQuery}
          selectedUsersWithRoles={formData.selectedUsersWithRoles}
          onUserRoleSelection={handleUserRoleSelection}
        />
      );
    case 'details':
      return (
        <TripDetailsStep
          notes={formData.notes}
          onNotesChange={(value) => handleInputChange('notes', value)}
          startDate={formData.startDate}
          onStartDateChange={(date) => handleDateChange('startDate', date)}
          endDate={formData.endDate}
          onEndDateChange={(date) => handleDateChange('endDate', date)}
        />
      );
    default:
      return null;
  }
};

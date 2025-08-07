
import { TripFormData } from '@/hooks/useTripForm';
import { useTrip } from '@/contexts/TripContext';
import { useRBAC } from '@/contexts/RBACContext';
import { useVans } from '@/hooks/useVans';

export const useTripSubmission = () => {
  const { addTrip } = useTrip();
  const { users } = useRBAC();
  const { vans } = useVans();

  const submitTrip = async (formData: TripFormData) => {
    console.log('Form data received:', formData);
    console.log('Available vans:', vans);
    
    const selectedVan = vans.find(van => van.id === formData.vanId);
    console.log('Selected van:', selectedVan);
    
    if (!selectedVan) {
      console.error('Van not found for ID:', formData.vanId);
      throw new Error('Van not found');
    }

    if (!formData.selectedCompanies || formData.selectedCompanies.length === 0) {
      throw new Error('At least one company must be selected');
    }

    // Use first company for legacy compatibility
    const primaryCompany = formData.selectedCompanies[0];

    const driverUserWithRole = formData.selectedUsersWithRoles.find(userWithRole =>
      userWithRole.roles.includes('Chauffeur')
    );

    let driverName = 'No Driver Assigned';
    if (driverUserWithRole) {
      const driverUser = users.find(user => user.id.toString() === driverUserWithRole.userId);
      if (driverUser) {
        driverName = driverUser.name;
      }
    }

    const tripData = {
      van: selectedVan.id,
      driver: driverName,
      company: primaryCompany.companyName,
      branch: primaryCompany.branchName,
      notes: formData.notes,
      userIds: formData.selectedUsersWithRoles.map(u => u.userId),
      userRoles: formData.selectedUsersWithRoles,
      startKm: parseInt(formData.startKm),
      startDate: formData.startDate,
      endDate: formData.endDate,
      selectedCompanies: formData.selectedCompanies // Pass all selected companies
    };

    console.log('Final trip data before submission:', tripData);
    console.log('Van ID being sent:', tripData.van);
    console.log('Selected companies being sent:', tripData.selectedCompanies);
    console.log('Number of companies:', tripData.selectedCompanies.length);

    if (!tripData.van) {
      throw new Error('Van ID is missing');
    }

    await addTrip(tripData);
  };

  return { submitTrip };
};

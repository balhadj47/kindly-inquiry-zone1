
import { TripFormData } from '@/hooks/useTripForm';
import { useTripContext } from '@/contexts/TripContext';
import { useRBAC } from '@/contexts/RBACContext';
import { useCompanies } from '@/hooks/useCompanies';
import { useVans } from '@/hooks/useVans';

export const useTripSubmission = () => {
  const { addTrip } = useTripContext();
  const { users } = useRBAC();
  const { companies } = useCompanies();
  const { vans } = useVans();

  const submitTrip = async (formData: TripFormData) => {
    const selectedVan = vans.find(van => van.id === formData.vanId);
    if (!selectedVan) {
      throw new Error('Van not found');
    }

    const selectedCompany = companies.find(company => company.id === formData.companyId);
    const selectedBranch = selectedCompany?.branches.find(branch => branch.id === formData.branchId);

    if (!selectedCompany || !selectedBranch) {
      throw new Error('Company or branch not found');
    }

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
      van: selectedVan.license_plate,
      driver: driverName,
      company: selectedCompany.name,
      branch: selectedBranch.name,
      notes: formData.notes,
      userIds: formData.selectedUsersWithRoles.map(u => u.userId),
      userRoles: formData.selectedUsersWithRoles,
      startKm: parseInt(formData.startKm),
    };

    console.log('Submitting trip data:', tripData);
    console.log('User roles for this mission:', tripData.userRoles);

    await addTrip(tripData);
  };

  return { submitTrip };
};

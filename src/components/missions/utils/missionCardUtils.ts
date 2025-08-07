
import { Trip } from '@/contexts/TripContext';
import { User } from '@/hooks/users/types';
import { Van } from '@/types/van';

export const getMissionTitle = (mission: Trip, vans: Van[]) => {
  const van = vans.find(v => v.id === mission.van || v.reference_code === mission.van);
  const vanReference = van?.reference_code || mission.van || 'Van inconnu';
  
  // Handle multiple companies
  if (mission.companies_data && Array.isArray(mission.companies_data) && mission.companies_data.length > 1) {
    const baseTitle = "Multiples Entreprises";
    return vanReference ? `${baseTitle} - ${vanReference}` : baseTitle;
  }
  
  // Single company (existing logic)
  const baseTitle = `${mission.company} - ${mission.branch}`;
  return vanReference ? `${baseTitle} - ${vanReference}` : baseTitle;
};

export const getCompanyDisplayText = (mission: Trip) => {
  if (mission.companies_data && Array.isArray(mission.companies_data) && mission.companies_data.length > 1) {
    return mission.companies_data
      .map(company => `${company.companyName} - ${company.branchName}`)
      .join(', ');
  }
  
  // Fallback to single company
  return `${mission.company} - ${mission.branch}`;
};

export const getDriverName = (mission: Trip, users: User[]) => {
  console.log('🚗 getDriverName: Mission data:', {
    id: mission.id,
    driver: mission.driver,
    userRoles: mission.userRoles,
    userIds: mission.userIds
  });
  console.log('🚗 getDriverName: Available users count:', users.length);

  // First, try to get driver name from userRoles (most accurate)
  if (mission?.userRoles && mission.userRoles.length > 0) {
    console.log('🚗 getDriverName: Checking userRoles...');
    const driverUserRole = mission.userRoles.find(userRole => 
      userRole.roles.some(role => {
        if (typeof role === 'string') {
          return role === 'Chauffeur';
        } else if (typeof role === 'object' && role !== null) {
          const roleObj = role as any;
          return roleObj.name === 'Chauffeur';
        }
        return false;
      })
    );

    if (driverUserRole) {
      console.log('🚗 getDriverName: Found driver userRole:', driverUserRole);
      // Try to find user in users array
      const user = users.find(u => {
        const userIdStr = u.id.toString();
        const missionUserIdStr = driverUserRole.userId.toString();
        console.log('🚗 getDriverName: Comparing user IDs:', { userIdStr, missionUserIdStr });
        return userIdStr === missionUserIdStr;
      });
      
      if (user) {
        console.log('🚗 getDriverName: Found user by userRole:', user.name);
        return user.name;
      } else {
        console.log('🚗 getDriverName: User not found in users array for userId:', driverUserRole.userId);
      }
    }
  }

  // Second, use mission.driver field directly (this should contain the actual name)
  if (mission?.driver && mission.driver.trim() !== '') {
    console.log('🚗 getDriverName: Checking mission.driver field:', mission.driver);
    // Check if it's not just a user ID (numeric string)
    const isNumericId = /^\d+$/.test(mission.driver.trim());
    if (!isNumericId) {
      console.log('🚗 getDriverName: Using mission.driver as name:', mission.driver);
      return mission.driver;
    }
    
    // If it is a numeric ID, try to find the user by ID
    console.log('🚗 getDriverName: mission.driver is numeric, searching users...');
    const userById = users.find(u => {
      const match = u.id.toString() === mission.driver;
      console.log('🚗 getDriverName: Comparing:', { userId: u.id, driverId: mission.driver, match });
      return match;
    });
    if (userById) {
      console.log('🚗 getDriverName: Found user by ID:', userById.name);
      return userById.name;
    } else {
      console.log('🚗 getDriverName: No user found for ID:', mission.driver);
    }
  }

  // Check if there's a user in userIds as fallback
  if (mission?.userIds && mission.userIds.length > 0) {
    console.log('🚗 getDriverName: Checking userIds as fallback...');
    for (const userId of mission.userIds) {
      const user = users.find(u => u.id.toString() === userId);
      if (user) {
        console.log('🚗 getDriverName: Found user from userIds:', user.name);
        return user.name;
      }
    }
  }

  // Final fallback
  console.log('🚗 getDriverName: No driver found, using fallback');
  return 'Aucun chauffeur assigné';
};

export const getStatusConfig = (status: string) => {
  switch (status) {
    case 'active':
      return { 
        label: 'Active', 
        variant: 'default' as const, 
        color: 'emerald' 
      };
    case 'completed':
      return { 
        label: 'Terminée', 
        variant: 'outline' as const, 
        color: 'blue' 
      };
    case 'terminated':
      return { 
        label: 'Annulée', 
        variant: 'destructive' as const, 
        color: 'red' 
      };
    default:
      return { 
        label: 'Inconnu', 
        variant: 'secondary' as const, 
        color: 'gray' 
      };
  }
};

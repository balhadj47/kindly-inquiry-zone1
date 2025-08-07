
import { Trip } from '@/contexts/TripContext';
import { User } from '@/hooks/users/types';
import { Van } from '@/types/van';

export const getMissionTitle = (mission: Trip, vans: Van[]) => {
  const van = vans.find(v => v.id === mission.van || v.reference_code === mission.van);
  const vanReference = van?.reference_code || '';
  
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
  // First, try to get driver name from userRoles (most accurate)
  if (mission?.userRoles && mission.userRoles.length > 0) {
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
      // Try to find user in users array
      const user = users.find(u => {
        const userIdStr = u.id.toString();
        const missionUserIdStr = driverUserRole.userId.toString();
        return userIdStr === missionUserIdStr;
      });
      
      if (user) {
        return user.name;
      }
      
      // If user not found in users array but we have userRole, 
      // still try mission.driver field as it might contain the actual name
      if (mission?.driver && mission.driver !== driverUserRole.userId.toString()) {
        return mission.driver;
      }
    }
  }

  // Second, use mission.driver field directly (this should contain the actual name)
  if (mission?.driver && mission.driver.trim() !== '') {
    // Check if it's not just a user ID (numeric string)
    const isNumericId = /^\d+$/.test(mission.driver.trim());
    if (!isNumericId) {
      return mission.driver;
    }
    
    // If it is a numeric ID, try to find the user by ID
    const userById = users.find(u => u.id.toString() === mission.driver);
    if (userById) {
      return userById.name;
    }
  }

  // Final fallback
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

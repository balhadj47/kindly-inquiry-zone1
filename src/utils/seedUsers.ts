
import { supabase } from '@/integrations/supabase/client';
import type { UserRole, UserStatus } from '@/types/rbac';

// Sample data for generating random users
const firstNames = [
  'Jean', 'Marie', 'Pierre', 'Sophie', 'Michel', 'Catherine', 'Philippe', 'Isabelle',
  'Alain', 'Nathalie', 'François', 'Sylvie', 'Laurent', 'Christine', 'Patrick', 'Martine',
  'André', 'Monique', 'Daniel', 'Nicole', 'Bernard', 'Françoise', 'Claude', 'Jacqueline',
  'René', 'Brigitte', 'Marcel', 'Chantal', 'Roger', 'Denise'
];

const lastNames = [
  'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand',
  'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David',
  'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel', 'Girard', 'André', 'Lefèvre',
  'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'François', 'Martinez'
];

const roles: UserRole[] = [
  'Administrator',
  'Employee',
  'Chef de Groupe Armé',
  'Chef de Groupe Sans Armé',
  'Chauffeur Armé',
  'Chauffeur Sans Armé',
  'APS Armé',
  'APS Sans Armé'
];

const statuses: UserStatus[] = ['Active', 'Inactive', 'Suspended', 'Récupération', 'Congé', 'Congé maladie'];

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const generateRandomPhone = (): string => {
  const prefixes = ['06', '07', '01', '02', '03', '04', '05'];
  const prefix = getRandomElement(prefixes);
  const number = Math.floor(Math.random() * 90000000) + 10000000;
  return `${prefix}${number.toString().padStart(8, '0')}`;
};

const generateRandomEmail = (firstName: string, lastName: string): string => {
  const domains = ['gmail.com', 'outlook.fr', 'yahoo.fr', 'hotmail.fr', 'free.fr'];
  const domain = getRandomElement(domains);
  const emailPrefix = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
  return `${emailPrefix}@${domain}`;
};

const getRoleIdForRole = (role: UserRole): number => {
  switch (role) {
    case 'Administrator':
      return 1;
    case 'Chef de Groupe Armé':
    case 'Chef de Groupe Sans Armé':
      return 2;
    case 'Chauffeur Armé':
    case 'Chauffeur Sans Armé':
      return 3;
    case 'APS Armé':
    case 'APS Sans Armé':
      return 4;
    default:
      return 5; // Employee
  }
};

export const generateRandomUsers = (count: number = 10) => {
  const users = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const role = getRandomElement(roles);
    const status = getRandomElement(statuses);
    const roleId = getRoleIdForRole(role);
    
    const user = {
      name: `${firstName} ${lastName}`,
      email: generateRandomEmail(firstName, lastName),
      phone: generateRandomPhone(),
      role,
      role_id: roleId,
      status,
      total_trips: Math.floor(Math.random() * 100),
      last_trip: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
    };
    
    users.push(user);
  }
  
  return users;
};

export const addRandomUsersToDatabase = async (count: number = 10) => {
  console.log(`Generating ${count} random users...`);
  
  try {
    const randomUsers = generateRandomUsers(count);
    
    console.log('Generated users:', randomUsers);
    
    const { data, error } = await supabase
      .from('users')
      .insert(randomUsers)
      .select();

    if (error) {
      console.error('Error adding random users to database:', error);
      throw new Error(`Failed to add users: ${error.message}`);
    }

    console.log(`Successfully added ${data?.length || 0} random users to database`);
    return data;
  } catch (error) {
    console.error('Error in addRandomUsersToDatabase:', error);
    throw error;
  }
};

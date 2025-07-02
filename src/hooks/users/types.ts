
export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role_id: number; // Changed from role to role_id
  status: string;
  created_at: string;
  auth_user_id?: string;
  profile_image?: string;
  total_trips?: number;
  last_trip?: string;
  badge_number?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  address?: string;
  driver_license?: string;
  // All new fields
  identification_national?: string;
  carte_national?: string;
  carte_national_start_date?: string;
  carte_national_expiry_date?: string;
  driver_license_start_date?: string;
  driver_license_expiry_date?: string;
  driver_license_category?: string[];
  driver_license_category_dates?: any;
  blood_type?: string;
  company_assignment_date?: string;
}

export type UsersQueryResult = {
  users: User[];
  total: number;
};

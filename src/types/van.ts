
export interface Van {
  id: string;
  license_plate: string;
  model: string;
  reference_code?: string;
  driver_id?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  insurer?: string;
  insurance_date?: string;
  control_date?: string;
  notes?: string;
  current_location?: string;
  current_responsible_id?: number | null;
  current_odometer_km?: number;
}

// Updated to match actual database schema
export interface VanLog {
  id: string;
  van_id: string;
  date: string;
  odometer_km?: number;
  category: 'maintenance' | 'repair' | 'inspection' | 'fuel' | 'general';
  title: string;
  details?: string;
  cost?: number;
  performed_by?: string;
  next_due_km?: number;
  next_due_date?: string;
  created_at: string;
  created_by?: string;
}

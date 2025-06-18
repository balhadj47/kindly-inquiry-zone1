
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
}

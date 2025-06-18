
export interface Trip {
  id: string;
  van: string;
  driver: string;
  company: string;
  branch: string;
  start_date: string;
  end_date: string | null;
  start_km: number;
  end_km: number | null;
  destination: string;
  notes?: string;
  company_id: string;
  branch_id: string;
  created_at: string;
  updated_at: string;
  status?: string;
  user_ids?: string[];
  user_roles?: any;
}

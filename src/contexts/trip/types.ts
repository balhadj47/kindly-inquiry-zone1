
import { MissionRole } from '@/types/missionRoles';

export interface UserWithRoles {
  userId: string;
  roles: MissionRole[];
}

export interface Trip {
  id: number;
  van: string;
  driver: string;
  company: string;
  branch: string;
  timestamp: string;
  notes: string;
  userIds: string[];
  userRoles?: UserWithRoles[];
  startKm?: number;
  endKm?: number;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  destination?: string;
  distance?: number;
  // Add database-compatible properties
  planned_start_date?: string;
  planned_end_date?: string;
  start_km?: number;
  end_km?: number;
  // Add missing timestamp properties for compatibility
  created_at?: string;
  updated_at?: string;
}

export interface TripContextType {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'timestamp'> & { userRoles: UserWithRoles[]; startKm: number; startDate?: Date; endDate?: Date }) => Promise<void>;
  deleteTrip: (tripId: number) => Promise<void>;
  endTrip: (tripId: number, endKm: number) => Promise<void>;
  refreshTrips: () => Promise<void>;
  error: string | null;
  isLoading: boolean;
  // Add missing properties
  loading: boolean;
  refetch: () => Promise<void>;
}

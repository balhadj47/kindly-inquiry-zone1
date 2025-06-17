
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
}

export interface TripContextType {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'timestamp'> & { userRoles: UserWithRoles[]; startKm: number; startDate?: Date; endDate?: Date }) => Promise<void>;
  deleteTrip: (tripId: number) => Promise<void>;
  endTrip: (tripId: number, endKm: number) => Promise<void>;
  refreshTrips: () => Promise<void>;
  error: string | null;
}

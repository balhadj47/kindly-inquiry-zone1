import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MissionRole } from '@/components/RoleSelectionSection';

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
  startKm?: number; // New field for starting kilometers
  endKm?: number; // New field for ending kilometers
  status?: string; // New field for trip status
}

interface TripContextType {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'timestamp'> & { userRoles?: UserWithRoles[]; startKm?: number }) => Promise<void>;
  deleteTrip: (tripId: number) => Promise<void>;
  endTrip: (tripId: number, endKm: number) => Promise<void>; // New method to end trips
  refreshTrips: () => Promise<void>;
  error: string | null;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};

interface TripProviderProps {
  children: ReactNode;
}

export const TripProvider: React.FC<TripProviderProps> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  // Fetch trips from database
  const fetchTrips = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Trips error:', error);
        throw error;
      }

      console.log('Fetched trips:', data);

      // Transform database data to match our Trip interface
      const transformedTrips = (data || []).map((trip: any) => ({
        id: trip.id,
        van: trip.van,
        driver: trip.driver,
        company: trip.company,
        branch: trip.branch,
        timestamp: trip.created_at,
        notes: trip.notes || '',
        userIds: trip.user_ids || [],
        userRoles: trip.user_roles || [],
        startKm: trip.start_km, // Include start kilometers
        endKm: trip.end_km, // Include end kilometers
        status: trip.status || 'active', // Include status
      }));

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setTrips(transformedTrips);
      }
    } catch (err) {
      console.error('Error fetching trips:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchTrips();
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const addTrip = async (tripData: Omit<Trip, 'id' | 'timestamp'> & { userRoles?: UserWithRoles[]; startKm?: number }) => {
    try {
      const { data, error } = await (supabase as any)
        .from('trips')
        .insert({
          van: tripData.van,
          driver: tripData.driver,
          company: tripData.company,
          branch: tripData.branch,
          notes: tripData.notes,
          user_ids: tripData.userIds,
          user_roles: tripData.userRoles || [],
          start_km: tripData.startKm, // Save start kilometers
          status: 'active', // New trips are active by default
        })
        .select()
        .single();

      if (error) {
        console.error('Insert trip error:', error);
        throw error;
      }

      console.log('Trip added successfully:', data);

      // Transform and add the new trip to the local state
      if (data && isMountedRef.current) {
        const newTrip: Trip = {
          id: data.id,
          van: data.van,
          driver: data.driver,
          company: data.company,
          branch: data.branch,
          timestamp: data.created_at,
          notes: data.notes || '',
          userIds: data.user_ids || [],
          userRoles: data.user_roles || [],
          startKm: data.start_km,
          endKm: data.end_km,
          status: data.status || 'active',
        };

        setTrips(prevTrips => [newTrip, ...prevTrips]);
      }
    } catch (err) {
      console.error('Error adding trip:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to add trip');
      }
      throw err;
    }
  };

  const endTrip = async (tripId: number, endKm: number) => {
    try {
      const { error } = await (supabase as any)
        .from('trips')
        .update({
          end_km: endKm,
          status: 'completed'
        })
        .eq('id', tripId);

      if (error) {
        console.error('End trip error:', error);
        throw error;
      }

      console.log('Trip ended successfully:', tripId);

      // Update the trip in local state
      if (isMountedRef.current) {
        setTrips(prevTrips => 
          prevTrips.map(trip => 
            trip.id === tripId 
              ? { ...trip, endKm, status: 'completed' }
              : trip
          )
        );
      }
    } catch (err) {
      console.error('Error ending trip:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to end trip');
      }
      throw err;
    }
  };

  const deleteTrip = async (tripId: number) => {
    try {
      const { error } = await (supabase as any)
        .from('trips')
        .delete()
        .eq('id', tripId);

      if (error) {
        console.error('Delete trip error:', error);
        throw error;
      }

      console.log('Trip deleted successfully:', tripId);

      // Remove the trip from local state
      if (isMountedRef.current) {
        setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripId));
      }
    } catch (err) {
      console.error('Error deleting trip:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to delete trip');
      }
      throw err;
    }
  };

  const refreshTrips = async () => {
    await fetchTrips();
  };

  return (
    <TripContext.Provider value={{ trips, addTrip, deleteTrip, endTrip, refreshTrips, error }}>
      {children}
    </TripContext.Provider>
  );
};


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Trip {
  id: number;
  van: string;
  driver: string;
  company: string;
  branch: string;
  timestamp: string;
  notes: string;
  userIds: string[];
}

interface TripContextType {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'timestamp'>) => Promise<void>;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch trips from database
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
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
          userIds: trip.user_ids || []
        }));

        setTrips(transformedTrips);
      } catch (err) {
        console.error('Error fetching trips:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const addTrip = async (tripData: Omit<Trip, 'id' | 'timestamp'>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('trips')
        .insert({
          van: tripData.van,
          driver: tripData.driver,
          company: tripData.company,
          branch: tripData.branch,
          notes: tripData.notes,
          user_ids: tripData.userIds
        })
        .select()
        .single();

      if (error) {
        console.error('Insert trip error:', error);
        throw error;
      }

      console.log('Trip added successfully:', data);

      // Transform and add the new trip to the local state
      if (data) {
        const newTrip: Trip = {
          id: data.id,
          van: data.van,
          driver: data.driver,
          company: data.company,
          branch: data.branch,
          timestamp: data.created_at,
          notes: data.notes || '',
          userIds: data.user_ids || []
        };

        setTrips(prevTrips => [newTrip, ...prevTrips]);
      }
    } catch (err) {
      console.error('Error adding trip:', err);
      setError(err instanceof Error ? err.message : 'Failed to add trip');
      throw err;
    }
  };

  return (
    <TripContext.Provider value={{ trips, addTrip, loading, error }}>
      {children}
    </TripContext.Provider>
  );
};

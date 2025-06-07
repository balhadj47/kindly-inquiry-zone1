
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Trip {
  id: number;
  van: string;
  driver: string;
  company: string;
  branch: string;
  timestamp: string;
  notes: string;
  userIds: string[]; // Add this field to track employees who worked on the trip
}

interface TripContextType {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'timestamp'>) => void;
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
  // Initial mock data with userIds
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: 1,
      van: 'VAN-001',
      driver: 'John Smith',
      company: 'ABC Corporation',
      branch: 'Downtown',
      timestamp: '2024-06-04 14:30:00',
      notes: 'Routine delivery',
      userIds: ['10', '14', '16'], // Sample user IDs
    },
    {
      id: 2,
      van: 'VAN-002',
      driver: 'Sarah Johnson',
      company: 'XYZ Logistics Ltd',
      branch: 'Industrial Park',
      timestamp: '2024-06-04 13:45:00',
      notes: 'Emergency pickup',
      userIds: ['11', '15'],
    },
    {
      id: 3,
      van: 'VAN-003',
      driver: 'Mike Wilson',
      company: 'DEF Industries Inc',
      branch: 'West Warehouse',
      timestamp: '2024-06-04 12:15:00',
      notes: '',
      userIds: ['12', '16', '17'],
    },
    {
      id: 4,
      van: 'VAN-001',
      driver: 'John Smith',
      company: 'ABC Corporation',
      branch: 'North Side',
      timestamp: '2024-06-04 11:00:00',
      notes: 'Multiple packages',
      userIds: ['10', '13', '14'],
    },
    {
      id: 5,
      van: 'VAN-004',
      driver: 'Lisa Chen',
      company: 'XYZ Logistics Ltd',
      branch: 'South Branch',
      timestamp: '2024-06-04 10:30:00',
      notes: 'Document delivery',
      userIds: ['12', '15'],
    },
  ]);

  const addTrip = (tripData: Omit<Trip, 'id' | 'timestamp'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: Math.max(...trips.map(t => t.id), 0) + 1,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    
    setTrips(prevTrips => [newTrip, ...prevTrips]);
  };

  return (
    <TripContext.Provider value={{ trips, addTrip }}>
      {children}
    </TripContext.Provider>
  );
};

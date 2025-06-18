
import React, { createContext, useContext, useEffect } from 'react';
import { useProgressiveLoading } from '@/hooks/useProgressiveLoading';
import { useRBAC } from '@/contexts/RBACContext';
import { useTrip } from '@/contexts/TripContext';

interface ProgressiveLoadingContextType {
  coreDataLoaded: boolean;
  secondaryDataLoaded: boolean;
  isInitializing: boolean;
  error: string | null;
}

const ProgressiveLoadingContext = createContext<ProgressiveLoadingContextType | undefined>(undefined);

export const ProgressiveLoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, loadCoreData, loadSecondaryData } = useProgressiveLoading();
  const { users, loading: rbacLoading } = useRBAC();
  const { trips, error: tripsError } = useTrip();

  // Monitor core data loading (RBAC and Trips)
  useEffect(() => {
    if (users && trips && !rbacLoading && !tripsError) {
      loadCoreData();
      
      // Start loading secondary data in background after core data is ready
      setTimeout(() => {
        loadSecondaryData();
      }, 100);
    }
  }, [users, trips, rbacLoading, tripsError, loadCoreData, loadSecondaryData]);

  const value: ProgressiveLoadingContextType = {
    coreDataLoaded: state.coreDataLoaded,
    secondaryDataLoaded: state.secondaryDataLoaded,
    isInitializing: state.isInitializing,
    error: state.error || tripsError
  };

  return (
    <ProgressiveLoadingContext.Provider value={value}>
      {children}
    </ProgressiveLoadingContext.Provider>
  );
};

export const useProgressiveLoadingContext = () => {
  const context = useContext(ProgressiveLoadingContext);
  if (context === undefined) {
    throw new Error('useProgressiveLoadingContext must be used within a ProgressiveLoadingProvider');
  }
  return context;
};

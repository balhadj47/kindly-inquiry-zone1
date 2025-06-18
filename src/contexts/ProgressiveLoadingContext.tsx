
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
  console.log('🔄 ProgressiveLoadingProvider: Initializing...');
  
  const { state, loadCoreData, loadSecondaryData } = useProgressiveLoading();
  
  // Safely access RBAC context with error handling
  let rbacUsers = null;
  let rbacLoading = false;
  let rbacError = null;
  
  try {
    const rbacContext = useRBAC();
    rbacUsers = rbacContext.users;
    rbacLoading = rbacContext.loading;
  } catch (error) {
    console.warn('🔄 ProgressiveLoadingProvider: RBAC context not available:', error);
    rbacError = error;
  }
  
  // Safely access Trip context with error handling
  let tripData = null;
  let tripError = null;
  
  try {
    const tripContext = useTrip();
    tripData = tripContext.trips;
    tripError = tripContext.error;
  } catch (error) {
    console.warn('🔄 ProgressiveLoadingProvider: Trip context not available:', error);
    tripError = error instanceof Error ? error.message : 'Trip context error';
  }

  // Monitor core data loading (RBAC and Trips)
  useEffect(() => {
    console.log('🔄 ProgressiveLoadingProvider: Data state check', {
      rbacUsers: !!rbacUsers,
      tripData: !!tripData,
      rbacLoading,
      tripError,
      rbacError: !!rbacError
    });
    
    if (rbacUsers && tripData && !rbacLoading && !tripError) {
      console.log('🔄 ProgressiveLoadingProvider: Loading core data...');
      loadCoreData();
      
      // Start loading secondary data in background after core data is ready
      setTimeout(() => {
        console.log('🔄 ProgressiveLoadingProvider: Loading secondary data...');
        loadSecondaryData();
      }, 100);
    }
  }, [rbacUsers, tripData, rbacLoading, tripError, rbacError, loadCoreData, loadSecondaryData]);

  const value: ProgressiveLoadingContextType = {
    coreDataLoaded: state.coreDataLoaded,
    secondaryDataLoaded: state.secondaryDataLoaded,
    isInitializing: state.isInitializing,
    error: state.error || tripError
  };

  console.log('🔄 ProgressiveLoadingProvider: Current state', value);

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

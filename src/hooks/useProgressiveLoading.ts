
import { useState, useEffect, useCallback } from 'react';

interface ProgressiveLoadingState {
  coreDataLoaded: boolean;
  secondaryDataLoaded: boolean;
  isInitializing: boolean;
  error: string | null;
}

interface ProgressiveLoadingHook {
  state: ProgressiveLoadingState;
  loadCoreData: () => Promise<void>;
  loadSecondaryData: () => Promise<void>;
  reset: () => void;
}

export const useProgressiveLoading = (): ProgressiveLoadingHook => {
  const [state, setState] = useState<ProgressiveLoadingState>({
    coreDataLoaded: false,
    secondaryDataLoaded: false,
    isInitializing: true,
    error: null
  });

  const loadCoreData = useCallback(async () => {
    try {
      console.log('🚀 Progressive Loading: Loading core data...');
      setState(prev => ({ ...prev, isInitializing: true, error: null }));
      
      // Core data is loaded by RBACContext and TripContext
      // This hook just tracks the state
      setState(prev => ({ 
        ...prev, 
        coreDataLoaded: true, 
        isInitializing: false 
      }));
      
      console.log('✅ Progressive Loading: Core data loaded');
    } catch (error) {
      console.error('❌ Progressive Loading: Core data error:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Core data loading failed',
        isInitializing: false 
      }));
    }
  }, []);

  const loadSecondaryData = useCallback(async () => {
    try {
      console.log('🚀 Progressive Loading: Loading secondary data...');
      
      // Secondary data loading happens in background
      // Companies and vans will load via their respective hooks
      setState(prev => ({ ...prev, secondaryDataLoaded: true }));
      
      console.log('✅ Progressive Loading: Secondary data loaded');
    } catch (error) {
      console.error('❌ Progressive Loading: Secondary data error:', error);
      // Don't set error for secondary data failures
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      coreDataLoaded: false,
      secondaryDataLoaded: false,
      isInitializing: true,
      error: null
    });
  }, []);

  return {
    state,
    loadCoreData,
    loadSecondaryData,
    reset
  };
};

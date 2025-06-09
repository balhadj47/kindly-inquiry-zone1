
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loadUserData, loadGroupsData } from './dataLoaders';
import { RBACState, RBACActions } from './types';

export const useRBACDataInit = (state: RBACState, dispatch: React.Dispatch<RBACActions>) => {
  const { user: authUser, loading: authLoading } = useAuth();

  useEffect(() => {
    const initializeData = async () => {
      console.log('RBAC Data Init - Auth user:', authUser);
      console.log('RBAC Data Init - Auth loading:', authLoading);
      
      if (authLoading) {
        console.log('Auth still loading, waiting...');
        return;
      }

      if (!authUser) {
        console.log('No authenticated user, resetting RBAC state');
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_USER', payload: null });
        return;
      }

      console.log('Loading user data for authenticated user:', authUser.id);
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // Load user data
        console.log('Calling loadUserData...');
        const userData = await loadUserData();
        console.log('User data loaded:', userData);
        dispatch({ type: 'SET_USER', payload: userData });

        // Load groups data
        console.log('Calling loadGroupsData...');
        const groupsData = await loadGroupsData();
        console.log('Groups data loaded:', groupsData);
        dispatch({ type: 'SET_GROUPS', payload: groupsData });
      } catch (error) {
        console.error('Error loading RBAC data:', error);
        dispatch({ type: 'SET_ERROR', payload: error as Error });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeData();
  }, [authUser, authLoading, dispatch]);
};

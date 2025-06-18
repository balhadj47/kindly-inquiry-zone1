
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loadUsers, loadRoles } from './dataLoaders';
import { createPermissionUtils } from './permissionUtils';
import { User } from '@/types/rbac';
import { SystemGroup } from '@/types/systemGroups';

interface RBACState {
  currentUser: User | null;
  users: User[];
  roles: SystemGroup[];
  loading: boolean;
}

interface RBACActions {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setRoles: React.Dispatch<React.SetStateAction<SystemGroup[]>>;
  setLoading: (loading: boolean) => void;
  setCurrentUser: (user: User | null) => void;
}

export const useRBACDataInit = (state: RBACState, actions: RBACActions) => {
  const { loading } = state;
  const { setUsers, setRoles, setLoading, setCurrentUser } = actions;
  const { user: authUser } = useAuth();
  const initializationRef = useRef<Promise<void> | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const initializeData = async () => {
      if (!authUser || hasInitialized.current) {
        console.log('🔄 Skipping RBAC initialization - no auth user or already initialized');
        if (!authUser) setLoading(false);
        return;
      }

      // Prevent multiple simultaneous initializations
      if (initializationRef.current) {
        console.log('🔄 RBAC initialization already in progress, waiting...');
        await initializationRef.current;
        return;
      }

      try {
        console.log('🚀 Starting optimized RBAC initialization for user:', authUser.email);
        setLoading(true);

        initializationRef.current = (async () => {
          // Load data in parallel for better performance
          console.log('📡 Loading system groups and users in parallel...');
          const startTime = performance.now();
          
          const [systemGroupsData, usersData] = await Promise.all([
            loadRoles().catch(error => {
              console.error('❌ Error loading roles:', error);
              return [];
            }),
            loadUsers().catch(error => {
              console.error('❌ Error loading users:', error);
              return [];
            })
          ]);

          console.log('✅ Parallel data loading completed in:', performance.now() - startTime, 'ms');
          console.log('✅ Data loaded - System groups:', systemGroupsData.length, 'Users:', usersData.length);

          // Set data immediately
          setRoles(systemGroupsData);
          setUsers(usersData);

          // Find and set current user
          let currentUserData = usersData.find(u => u.email === authUser.email);
          
          if (!currentUserData) {
            console.warn('⚠️ User not found in database, creating basic user:', authUser.email);
            // Create a basic user object if not found in database
            currentUserData = {
              id: authUser.id,
              name: authUser.email.split('@')[0],
              email: authUser.email,
              phone: '',
              systemGroup: 'Employee', // Default role
              status: 'Active',
              createdAt: new Date().toISOString(),
              get role() { return this.systemGroup; }
            };
          }

          setCurrentUser(currentUserData);
          console.log('✅ Current user set:', currentUserData.email, 'Role:', currentUserData.systemGroup);

          // Create permission utilities if we have the required data
          if (systemGroupsData.length > 0) {
            console.log('🔧 Creating permission utilities...');
            createPermissionUtils(usersData, systemGroupsData);
            console.log('✅ Permission utilities ready');
          } else {
            console.warn('⚠️ No system groups loaded, permission utils not created');
          }

          hasInitialized.current = true;
          console.log('✅ RBAC initialization complete in:', performance.now() - startTime, 'ms');
        })();

        await initializationRef.current;

      } catch (error) {
        console.error('❌ RBAC initialization failed:', error);
        
        // Create fallback user even on error
        if (authUser) {
          const fallbackUser: User = {
            id: authUser.id,
            name: authUser.email.split('@')[0],
            email: authUser.email,
            phone: '',
            systemGroup: 'Employee',
            status: 'Active',
            createdAt: new Date().toISOString(),
            get role() { return this.systemGroup; }
          };
          setCurrentUser(fallbackUser);
          console.log('✅ Created fallback user after error');
        }
      } finally {
        setLoading(false);
        initializationRef.current = null;
      }
    };

    // Only initialize once when auth user is available and not already initialized
    if (authUser && loading && !hasInitialized.current) {
      initializeData();
    }
  }, [authUser?.email, authUser?.id, loading]); // Simplified dependencies

  // Reset initialization flag when user changes
  useEffect(() => {
    if (!authUser) {
      hasInitialized.current = false;
    }
  }, [authUser?.email]);
};

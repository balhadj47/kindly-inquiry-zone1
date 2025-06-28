
import { useEffect } from 'react';
import { testUserPermissions } from '@/integrations/supabase/client';

export const usePermissionDebug = () => {
  useEffect(() => {
    // Test permissions on component mount
    const runTest = async () => {
      await testUserPermissions();
    };
    
    runTest();
  }, []);

  return { testUserPermissions };
};

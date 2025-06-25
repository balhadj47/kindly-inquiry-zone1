
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRBAC } from '@/contexts/RBACContext';

const DebugConsole = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const { currentUser, loading: rbacLoading, hasPermission } = useRBAC();

  useEffect(() => {
    console.log('🔍 DEBUG CONSOLE: Full application state:', {
      auth: {
        user: authUser ? {
          id: authUser.id,
          email: authUser.email,
          user_metadata: authUser.user_metadata
        } : null,
        loading: authLoading
      },
      rbac: {
        currentUser: currentUser ? {
          id: currentUser.id,
          email: currentUser.email,
          role_id: currentUser.role_id
        } : null,
        loading: rbacLoading,
        hasPermissionFunction: typeof hasPermission
      },
      location: {
        pathname: window.location.pathname,
        href: window.location.href
      },
      timestamp: new Date().toISOString()
    });

    // Test permission function
    try {
      const testPermission = hasPermission('dashboard:read');
      console.log('🔍 DEBUG: Permission test result:', {
        permission: 'dashboard:read',
        result: testPermission,
        currentUserId: currentUser?.id || 'null'
      });
    } catch (error) {
      console.error('🚨 DEBUG: Permission test failed:', error);
    }
  }, [authUser, authLoading, currentUser, rbacLoading, hasPermission]);

  return null;
};

export default DebugConsole;

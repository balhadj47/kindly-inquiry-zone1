
import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useRBAC } from '@/contexts/RBACContext';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import AppSidebar from '@/components/AppSidebar';
import TopBar from '@/components/TopBar';
import MobileBottomNav from '@/components/MobileBottomNav';
import ErrorTracker from '@/components/ErrorTracker';
import DebugConsole from '@/components/DebugConsole';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Import all pages directly instead of lazy loading to fix 404 errors
import UserSettings from '@/pages/UserSettings';
import SystemSettingsPage from '@/pages/SystemSettingsPage';
import TripLoggerPage from '@/pages/TripLoggerPage';
import TripHistoryPage from '@/pages/TripHistoryPage';
import AuthUsersPage from '@/pages/AuthUsersPage';
import Dashboard from '@/components/Dashboard';
import Companies from '@/components/Companies';
import Vans from '@/components/Vans';
import Users from '@/components/Users';
import Employees from '@/components/Employees';

const PageLoadingSkeleton = () => (
  <div className="space-y-6 p-6">
    <Skeleton className="h-8 w-64" />
    <div className="grid gap-6">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

const AccessDenied = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
      <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
    </div>
  </div>
);

const Index = () => {
  console.log('📱 Index: Starting render process...');
  console.log('📱 Index: Current URL:', window.location.pathname);
  console.log('📱 Index: Timestamp:', new Date().toISOString());
  
  const isMobile = useIsMobile();
  const { user: authUser, loading: authLoading } = useAuth();
  
  // Safely get RBAC context with error handling
  let rbacContext;
  try {
    rbacContext = useRBAC();
    console.log('📱 Index: RBAC context accessed successfully');
  } catch (error) {
    console.error('❌ Index: Failed to access RBAC context:', error);
    rbacContext = {
      currentUser: null,
      loading: true,
      hasPermission: () => false
    };
  }
  
  // Extract values safely with fallbacks
  const currentUser = rbacContext?.currentUser || null;
  const rbacLoading = rbacContext?.loading ?? true;
  const hasPermission = rbacContext?.hasPermission || (() => false);

  console.log('📱 Index: Auth and RBAC state:', {
    authUser: authUser?.email || 'null',
    authLoading,
    currentUserId: currentUser?.id || 'null',
    currentUserRoleId: currentUser?.role_id || 'null',
    rbacLoading,
    hasPermissionAvailable: typeof hasPermission === 'function'
  });

  // Enhanced permission check wrapper with better error handling
  const checkPermission = React.useCallback((permission: string): boolean => {
    console.log('🔐 Index: Permission check requested:', permission);
    
    try {
      // If auth is still loading, allow access to prevent blocking
      if (authLoading) {
        console.log('🔐 Index: Auth still loading, allowing access temporarily');
        return true;
      }

      // If no auth user, deny access
      if (!authUser) {
        console.log('🔐 Index: No auth user, denying access');
        return false;
      }

      // If RBAC is still loading but we have an auth user, allow access
      if (rbacLoading && authUser) {
        console.log('🔐 Index: RBAC loading but auth user exists, allowing access');
        return true;
      }

      // Validate permission parameter
      if (!permission || typeof permission !== 'string' || permission.trim() === '') {
        console.warn('🔐 Index: Invalid permission parameter:', permission);
        return false;
      }

      // Special handling for admin users - always grant access
      if (currentUser?.role_id === 1) {
        console.log('🔓 Index: Admin user detected - granting permission:', permission);
        return true;
      }

      // Use permission system with enhanced error handling
      if (typeof hasPermission !== 'function') {
        console.warn('🔐 Index: hasPermission is not a function, falling back to auth user check');
        return !!authUser;
      }

      const result = hasPermission(permission);
      console.log('🔐 Index: Permission check result:', {
        permission,
        result: Boolean(result),
        userId: currentUser?.id || 'null'
      });
      
      return Boolean(result);

    } catch (error) {
      console.error('❌ Index: Critical error in permission check:', {
        permission,
        error: error?.message || 'Unknown error',
        currentUserId: currentUser?.id || 'null',
        authUserId: authUser?.id || 'null'
      });
      
      // Fallback - if we have an auth user, allow access
      if (authUser) {
        console.log('🔧 Index: Fallback access granted due to error - auth user exists');
        return true;
      }
      return false;
    }
  }, [hasPermission, currentUser, authUser, rbacLoading, authLoading]);

  // Show loading while auth is still loading
  if (authLoading) {
    console.log('📱 Index: Showing loading skeleton - Auth still loading');
    return <PageLoadingSkeleton />;
  }

  // If no auth user, show access denied
  if (!authUser) {
    console.log('📱 Index: No auth user - showing access denied');
    return <AccessDenied />;
  }

  console.log('📱 Index: Rendering main application layout with auth user:', authUser.email);

  return (
    <>
      <ErrorTracker />
      <DebugConsole />
      <Toaster />
      <Sonner />
      
      <TooltipProvider>
        <SidebarProvider defaultOpen={!isMobile}>
          <div className="min-h-screen flex w-full overflow-hidden">
            {!isMobile && <AppSidebar />}
            
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-200 h-screen">
              <TopBar />
              <main className={`flex-1 bg-gray-50 overflow-y-auto overflow-x-hidden ${
                isMobile ? 'p-3 pb-20' : 'p-3 sm:p-4 lg:p-6'
              }`}>
                <Suspense fallback={<PageLoadingSkeleton />}>
                  <Routes>
                    <Route path="/" element={
                      checkPermission('dashboard:read') ? <Dashboard /> : <AccessDenied />
                    } />
                    <Route path="/dashboard" element={
                      checkPermission('dashboard:read') ? <Dashboard /> : <AccessDenied />
                    } />
                    <Route path="/companies/*" element={
                      checkPermission('companies:read') ? <Companies /> : <AccessDenied />
                    } />
                    <Route path="/vans-drivers" element={
                      checkPermission('vans:read') ? <Vans /> : <AccessDenied />
                    } />
                    <Route path="/vans/*" element={
                      checkPermission('vans:read') ? <Vans /> : <AccessDenied />
                    } />
                    <Route path="/users" element={
                      checkPermission('users:read') ? <Users /> : <AccessDenied />
                    } />
                    <Route path="/auth-users" element={
                      checkPermission('users:read') ? <AuthUsersPage /> : <AccessDenied />
                    } />
                    <Route path="/employees" element={
                      checkPermission('users:read') ? <Employees /> : <AccessDenied />
                    } />
                    <Route path="/log-trip" element={
                      checkPermission('trips:create') ? <TripLoggerPage /> : <AccessDenied />
                    } />
                    <Route path="/trip-logger" element={
                      checkPermission('trips:create') ? <TripLoggerPage /> : <AccessDenied />
                    } />
                    <Route path="/trip-history" element={
                      checkPermission('trips:read') ? <TripHistoryPage /> : <AccessDenied />
                    } />
                    <Route path="/settings" element={<SystemSettingsPage />} />
                    <Route path="/user-settings" element={<UserSettings />} />
                  </Routes>
                </Suspense>
              </main>
            </div>
            
            {isMobile && <MobileBottomNav />}
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </>
  );
};

export default Index;

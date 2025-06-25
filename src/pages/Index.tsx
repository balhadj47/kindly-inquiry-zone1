
import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useRBAC } from '@/contexts/RBACContext';
import { useIsMobile } from '@/hooks/use-mobile';
import AppSidebar from '@/components/AppSidebar';
import TopBar from '@/components/TopBar';
import MobileBottomNav from '@/components/MobileBottomNav';
import ErrorTracker from '@/components/ErrorTracker';
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
  
  // Always call useRBAC hook consistently
  const rbacContext = useRBAC();
  
  // Extract values safely with fallbacks
  const hasPermission = React.useMemo(() => {
    if (rbacContext && typeof rbacContext.hasPermission === 'function') {
      return rbacContext.hasPermission;
    }
    return (permission: string) => {
      console.warn('📱 Index: hasPermission not available, using fallback');
      return false;
    };
  }, [rbacContext]);
  
  const currentUser = rbacContext?.currentUser || null;
  const loading = rbacContext?.loading ?? true;

  console.log('📱 Index: Final context state:', {
    isMobile,
    currentUserId: currentUser?.id || 'null',
    currentUserRoleId: currentUser?.role_id || 'null',
    loading,
    hasPermissionAvailable: typeof hasPermission === 'function',
    rbacContextAvailable: !!rbacContext
  });

  // Enhanced permission check wrapper with consistent hooks
  const checkPermission = React.useCallback((permission: string): boolean => {
    console.log('🔐 Index: Permission check requested:', permission);
    
    try {
      // Validate permission parameter
      if (!permission || typeof permission !== 'string' || permission.trim() === '') {
        console.warn('🔐 Index: Invalid permission parameter:', {
          permission,
          type: typeof permission,
          length: permission?.length || 0
        });
        return false;
      }

      // Check for current user
      if (!currentUser || !currentUser.id) {
        console.log('🔐 Index: No current user for permission check:', {
          currentUser: currentUser ? 'exists but no id' : 'null',
          permission
        });
        return false;
      }

      // Execute permission check
      const result = hasPermission(permission);
      const booleanResult = Boolean(result);
      
      console.log('🔐 Index: Permission check result:', {
        permission,
        userId: currentUser.id,
        userRoleId: currentUser.role_id,
        result: booleanResult,
        rawResult: result
      });
      
      return booleanResult;
      
    } catch (error) {
      console.error('❌ Index: Critical error in permission check:', {
        permission,
        error: error?.message || 'Unknown error',
        stack: error?.stack?.substring(0, 200) || 'No stack trace',
        currentUserId: currentUser?.id || 'null',
        timestamp: new Date().toISOString()
      });
      
      // Fallback for administrators in case of errors
      if (currentUser?.role_id === 1 || currentUser?.id === 'admin-temp') {
        console.log('🔧 Index: Fallback admin access granted due to error');
        return true;
      }
      return false;
    }
  }, [hasPermission, currentUser]);

  // Show loading while RBAC is initializing
  if (loading) {
    console.log('📱 Index: Showing loading skeleton - RBAC still loading');
    return <PageLoadingSkeleton />;
  }

  console.log('📱 Index: Rendering main application layout');

  return (
    <>
      <ErrorTracker />
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

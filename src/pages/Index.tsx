
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
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Import all pages directly
import UserSettings from '@/pages/UserSettings';
import SystemSettingsPage from '@/pages/SystemSettingsPage';
import TripLoggerPage from '@/pages/TripLoggerPage';
import TripHistoryPage from '@/pages/TripHistoryPage';
import MissionsPage from '@/pages/MissionsPage';
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
  
  const isMobile = useIsMobile();
  const { user: authUser, loading: authLoading } = useAuth();
  const { currentUser, loading: rbacLoading, hasPermission } = useRBAC();

  console.log('📱 Index: State check:', {
    authUser: authUser?.email || 'null',
    authLoading,
    currentUser: currentUser?.id || 'null',
    rbacLoading,
    isMobile,
    timestamp: new Date().toISOString()
  });

  // Enhanced permission check with better error handling
  const checkPermission = React.useCallback((permission: string): boolean => {
    console.log('📱 Index: Checking permission:', permission);

    try {
      // If still loading, allow access to prevent blank screens
      if (authLoading || rbacLoading) {
        console.log('📱 Index: Still loading, allowing access');
        return true;
      }

      // If no auth user, deny access
      if (!authUser) {
        console.log('📱 Index: No auth user, denying access');
        return false;
      }

      // Admin bypass for known admin emails
      if (authUser.email === 'gb47@msn.com' || authUser.email === 'kacemdbz@gmail.com') {
        console.log('📱 Index: Admin bypass granted');
        return true;
      }

      // If RBAC user exists and hasPermission function is available
      if (currentUser && hasPermission && typeof hasPermission === 'function') {
        try {
          const result = hasPermission(permission);
          console.log('📱 Index: Permission result:', result);
          return result;
        } catch (error) {
          console.error('📱 Index: Error checking permission:', error);
          // Fall back to allowing access if there's an error
          return true;
        }
      }

      // For authenticated users without RBAC context, allow access
      console.log('📱 Index: Authenticated user without RBAC, allowing access');
      return true;
    } catch (error) {
      console.error('📱 Index: Error in checkPermission:', error);
      // On error, allow access to prevent app from breaking
      return true;
    }
  }, [authUser, currentUser, hasPermission, authLoading, rbacLoading]);

  // Show loading while auth is loading
  if (authLoading) {
    console.log('📱 Index: Showing loading - Auth loading');
    return <PageLoadingSkeleton />;
  }

  // If no auth user, show access denied
  if (!authUser) {
    console.log('📱 Index: No auth user - showing access denied');
    return <AccessDenied />;
  }

  console.log('📱 Index: Rendering main application');

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
                      checkPermission('dashboard:read') ? (
                        <Dashboard />
                      ) : (
                        <AccessDenied />
                      )
                    } />
                    <Route path="/dashboard" element={
                      checkPermission('dashboard:read') ? <Dashboard /> : <AccessDenied />
                    } />
                    <Route path="/companies/*" element={
                      checkPermission('companies:read') ? <Companies /> : <AccessDenied />
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
                    <Route path="/missions" element={
                      checkPermission('trips:read') ? <MissionsPage /> : <AccessDenied />
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

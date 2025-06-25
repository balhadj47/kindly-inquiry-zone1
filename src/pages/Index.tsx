
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
  console.log('📱 Index: Rendering main app...');
  console.log('📱 Index: Current URL:', window.location.pathname);
  
  const isMobile = useIsMobile();
  
  // Safely access RBAC context with better error handling
  let hasPermission: (permission: string) => boolean = () => {
    console.warn('⚠️ hasPermission called before RBAC context loaded');
    return false;
  };
  let currentUser: any = null;
  let loading = true;
  
  try {
    const rbacContext = useRBAC();
    if (rbacContext && typeof rbacContext === 'object') {
      hasPermission = rbacContext.hasPermission || (() => {
        console.warn('⚠️ hasPermission function not available in RBAC context');
        return false;
      });
      currentUser = rbacContext.currentUser;
      loading = rbacContext.loading;
      console.log('📱 Index: RBAC context loaded successfully');
    } else {
      console.error('❌ Index: RBAC context is null or undefined');
    }
  } catch (error) {
    console.error('📱 Index: Error accessing RBAC context:', error);
    // Continue with default values (no access)
  }

  console.log('📱 Index: Context state:', {
    isMobile,
    currentUserId: currentUser?.id,
    currentUserRoleId: currentUser?.role_id,
    loading,
    hasPermissionType: typeof hasPermission
  });

  // Show loading while RBAC is initializing
  if (loading) {
    console.log('📱 Index: Showing loading skeleton');
    return <PageLoadingSkeleton />;
  }

  // Safe permission check wrapper
  const checkPermission = (permission: string): boolean => {
    try {
      if (typeof hasPermission !== 'function') {
        console.warn('📱 Index: hasPermission is not a function:', typeof hasPermission);
        return false;
      }
      const result = hasPermission(permission);
      console.log('📱 Index: Permission check:', permission, '=', result);
      return result;
    } catch (error) {
      console.error('📱 Index: Error checking permission:', permission, error);
      return false;
    }
  };

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
                    <Route path="/settings" element={<UserSettings />} />
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

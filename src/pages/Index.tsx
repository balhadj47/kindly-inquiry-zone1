import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
import AppSidebar from '@/components/AppSidebar';
import TopBar from '@/components/TopBar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SafeComponent } from '@/components/SafeComponent';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocation } from 'react-router-dom';

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
  const isMobile = useIsMobile();
  const location = useLocation();
  const { user: authUser, loading: authLoading } = useAuth();
  const permissions = useSecurePermissions();

  // Check if current page needs special layout (no scrolling, full height)
  const isEmployeesPage = location.pathname === '/employees';

  // Add error boundary logging
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('🔴 Global JavaScript error:', event.error);
      console.error('🔴 Error details:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🔴 Unhandled promise rejection:', event.reason);
      console.error('🔴 Promise rejection stack:', event.reason?.stack);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Enhanced logging for debugging
  React.useEffect(() => {
    console.log('📍 Index component state:', {
      authLoading,
      authUser: !!authUser,
      authUserId: authUser?.id,
      authUserEmail: authUser?.email,
      isMobile,
      permissionsLoaded: !!permissions,
      timestamp: new Date().toISOString()
    });
  }, [authLoading, authUser, isMobile, permissions]);

  // Add null checks for safety
  if (authLoading) {
    console.log('📍 Index: Still loading auth...');
    return (
      <ErrorBoundary>
        <PageLoadingSkeleton />
      </ErrorBoundary>
    );
  }

  if (!authUser) {
    console.log('📍 Index: No auth user, showing access denied');
    return (
      <ErrorBoundary>
        <AccessDenied />
      </ErrorBoundary>
    );
  }

  console.log('📍 Index: Rendering main app with permissions:', {
    canAccessDashboard: permissions.canAccessDashboard,
    canReadCompanies: permissions.canReadCompanies,
    canReadVans: permissions.canReadVans,
    canReadUsers: permissions.canReadUsers,
    canReadAuthUsers: permissions.canReadAuthUsers,
    canCreateTrips: permissions.canCreateTrips,
    canReadTrips: permissions.canReadTrips,
    isAdmin: permissions.isAdmin,
    isViewOnly: permissions.isViewOnly,
    currentUser: permissions.currentUser
  });

  return (
    <ErrorBoundary>
      <Sonner />
      
      <div className="min-h-screen bg-gray-50">
        <TooltipProvider>
          {/* Fixed Sidebar - Only show on desktop */}
          <SafeComponent componentName="AppSidebar">
            {!isMobile && <AppSidebar />}
          </SafeComponent>
          
          {/* Main content area - properly offset by sidebar width on desktop */}
          <div className={`min-h-screen ${!isMobile ? 'pl-64' : ''}`}>
            {/* Fixed TopBar */}
            <SafeComponent componentName="TopBar">
              <TopBar />
            </SafeComponent>
            
            {/* Scrollable Main Content */}
            <main className="bg-gray-50">
              <div className={`${
                isEmployeesPage 
                  ? 'h-full p-6' 
                  : isMobile 
                    ? 'p-3 pb-20' 
                    : 'p-3 sm:p-4 lg:p-6'
              }`}>
                <Suspense fallback={<PageLoadingSkeleton />}>
                  <Routes>
                    <Route path="" element={
                      <SafeComponent componentName="Dashboard">
                        {permissions.canAccessDashboard ? <Dashboard /> : <AccessDenied />}
                      </SafeComponent>
                    } />
                    <Route path="dashboard" element={
                      <SafeComponent componentName="Dashboard">
                        {permissions.canAccessDashboard ? <Dashboard /> : <AccessDenied />}
                      </SafeComponent>
                    } />
                    <Route path="companies/*" element={
                      <SafeComponent componentName="Companies">
                        {permissions.canReadCompanies ? <Companies /> : <AccessDenied />}
                      </SafeComponent>
                    } />
                    <Route path="vans/*" element={
                      <SafeComponent componentName="Vans">
                        {permissions.canReadVans ? <Vans /> : <AccessDenied />}
                      </SafeComponent>
                    } />
                    <Route path="users" element={
                      <SafeComponent componentName="Users">
                        {permissions.canReadUsers ? <Users /> : <AccessDenied />}
                      </SafeComponent>
                    } />
                    <Route path="auth-users" element={
                      <SafeComponent componentName="AuthUsers">
                        {permissions.canReadAuthUsers ? <AuthUsersPage /> : <AccessDenied />}
                      </SafeComponent>
                    } />
                    <Route path="employees" element={
                      <SafeComponent componentName="Employees">
                        {permissions.canReadUsers ? <Employees /> : <AccessDenied />}
                      </SafeComponent>
                    } />
                    <Route path="log-trip" element={
                      <SafeComponent componentName="TripLogger">
                        {permissions.canCreateTrips ? <TripLoggerPage /> : <AccessDenied />}
                      </SafeComponent>
                    } />
                    <Route path="trip-logger" element={
                      <SafeComponent componentName="TripLogger">
                        {permissions.canCreateTrips ? <TripLoggerPage /> : <AccessDenied />}
                      </SafeComponent>
                    } />
                    <Route path="missions" element={
                      <SafeComponent componentName="Missions">
                        {permissions.canReadTrips ? <MissionsPage /> : <AccessDenied />}
                      </SafeComponent>
                    } />
                    <Route path="trip-history" element={
                      <SafeComponent componentName="TripHistory">
                        {permissions.canReadTrips ? <TripHistoryPage /> : <AccessDenied />}
                      </SafeComponent>
                    } />
                    <Route path="settings" element={
                      <SafeComponent componentName="SystemSettings">
                        <SystemSettingsPage />
                      </SafeComponent>
                    } />
                    <Route path="user-settings" element={
                      <SafeComponent componentName="UserSettings">
                        <UserSettings />
                      </SafeComponent>
                    } />
                  </Routes>
                </Suspense>
              </div>
            </main>
          </div>
          
          {/* Mobile Bottom Navigation */}
          <SafeComponent componentName="MobileBottomNav">
            {isMobile && <MobileBottomNav />}
          </SafeComponent>
        </TooltipProvider>
      </div>
    </ErrorBoundary>
  );
};

export default Index;

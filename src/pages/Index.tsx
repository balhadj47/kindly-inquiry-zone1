
import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSecurePermissions } from '@/hooks/useSecurePermissions';
import { SidebarInset } from '@/components/ui/sidebar';
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
  const isMobile = useIsMobile();
  const { user: authUser, loading: authLoading } = useAuth();
  const permissions = useSecurePermissions();

  // Show loading while auth is loading
  if (authLoading) {
    return <PageLoadingSkeleton />;
  }

  // If no auth user, show access denied
  if (!authUser) {
    return <AccessDenied />;
  }

  return (
    <>
      <ErrorTracker />
      <Sonner />
      
      <TooltipProvider>
        {/* Desktop Sidebar */}
        {!isMobile && <AppSidebar />}
        
        {/* Main Content Area */}
        <SidebarInset>
          <TopBar />
          <main className={`flex-1 bg-gray-50 overflow-y-auto ${
            isMobile ? 'p-3 pb-20' : 'p-3 sm:p-4 lg:p-6'
          }`}>
            <Suspense fallback={<PageLoadingSkeleton />}>
              <Routes>
                <Route path="" element={
                  permissions.canAccessDashboard ? <Dashboard /> : <AccessDenied />
                } />
                <Route path="dashboard" element={
                  permissions.canAccessDashboard ? <Dashboard /> : <AccessDenied />
                } />
                <Route path="companies/*" element={
                  permissions.canReadCompanies ? <Companies /> : <AccessDenied />
                } />
                <Route path="vans/*" element={
                  permissions.canReadVans ? <Vans /> : <AccessDenied />
                } />
                <Route path="users" element={
                  permissions.canReadUsers ? <Users /> : <AccessDenied />
                } />
                <Route path="auth-users" element={
                  permissions.canReadAuthUsers ? <AuthUsersPage /> : <AccessDenied />
                } />
                <Route path="employees" element={
                  permissions.canReadUsers ? <Employees /> : <AccessDenied />
                } />
                <Route path="log-trip" element={
                  permissions.canCreateTrips ? <TripLoggerPage /> : <AccessDenied />
                } />
                <Route path="trip-logger" element={
                  permissions.canCreateTrips ? <TripLoggerPage /> : <AccessDenied />
                } />
                <Route path="missions" element={
                  permissions.canReadTrips ? <MissionsPage /> : <AccessDenied />
                } />
                <Route path="trip-history" element={
                  permissions.canReadTrips ? <TripHistoryPage /> : <AccessDenied />
                } />
                <Route path="settings" element={<SystemSettingsPage />} />
                <Route path="user-settings" element={<UserSettings />} />
              </Routes>
            </Suspense>
          </main>
        </SidebarInset>
        
        {/* Mobile Bottom Navigation */}
        {isMobile && <MobileBottomNav />}
      </TooltipProvider>
    </>
  );
};

export default Index;

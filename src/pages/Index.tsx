
import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useRBAC } from '@/contexts/RBACContext';
import { useIsMobile } from '@/hooks/use-mobile';
import AppSidebar from '@/components/AppSidebar';
import TopBar from '@/components/TopBar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { Suspense, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load all page components
const Dashboard = React.lazy(() => import('@/components/Dashboard'));
const Companies = React.lazy(() => import('@/components/Companies'));
const Vans = React.lazy(() => import('@/components/Vans'));
const Users = React.lazy(() => import('@/components/Users'));
const TripLogger = React.lazy(() => import('@/components/TripLogger'));
const TripHistory = React.lazy(() => import('@/components/TripHistory'));
const UserSettings = React.lazy(() => import('@/pages/UserSettings'));

// Lazy load components that use React hooks
const TooltipProvider = React.lazy(() => 
  import('@/components/ui/tooltip').then(module => ({ default: module.TooltipProvider }))
);
const Toaster = React.lazy(() => 
  import('@/components/ui/toaster').then(module => ({ default: module.Toaster }))
);
const Sonner = React.lazy(() => 
  import('@/components/ui/sonner').then(module => ({ default: module.Toaster }))
);

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

const Index = () => {
  console.log('📱 Index: Rendering main app...');
  
  const isMobile = useIsMobile();
  const [isReady, setIsReady] = useState(false);
  
  // Wait for React to be fully ready before rendering components with hooks
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Safely access RBAC context
  let hasPermission: (permission: string) => boolean = () => false;
  try {
    const rbacContext = useRBAC();
    hasPermission = rbacContext.hasPermission;
    console.log('📱 Index: RBAC context loaded successfully');
  } catch (error) {
    console.error('📱 Index: Error accessing RBAC context:', error);
    // Continue with no permissions for now
  }

  console.log('📱 Index: isMobile:', isMobile);

  if (!isReady) {
    return <PageLoadingSkeleton />;
  }

  return (
    <Suspense fallback={<PageLoadingSkeleton />}>
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
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/companies/*" element={
                      hasPermission('companies:read') ? <Companies /> : <div>Access Denied</div>
                    } />
                    <Route path="/vans" element={
                      hasPermission('vans:read') ? <Vans /> : <div>Access Denied</div>
                    } />
                    <Route path="/users" element={
                      hasPermission('users:read') ? <Users /> : <div>Access Denied</div>
                    } />
                    <Route path="/trip-logger" element={
                      hasPermission('trips:create') ? <TripLogger /> : <div>Access Denied</div>
                    } />
                    <Route path="/trip-history" element={
                      hasPermission('trips:read') ? <TripHistory /> : <div>Access Denied</div>
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
    </Suspense>
  );
};

export default Index;

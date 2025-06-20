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
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Import all pages directly instead of lazy loading to fix 404 errors
import UserSettings from '@/pages/UserSettings';
import TripLoggerPage from '@/pages/TripLoggerPage';
import TripHistoryPage from '@/pages/TripHistoryPage';
import Dashboard from '@/components/Dashboard';
import Companies from '@/components/Companies';
import Vans from '@/components/Vans';
import Users from '@/components/Users';

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
  console.log('📱 Index: Current URL:', window.location.pathname);
  
  const isMobile = useIsMobile();
  
  // Safely access RBAC context
  let hasPermission: (permission: string) => boolean = () => true; // Default to true to avoid blocking
  try {
    const rbacContext = useRBAC();
    hasPermission = rbacContext.hasPermission || (() => true);
    console.log('📱 Index: RBAC context loaded successfully');
  } catch (error) {
    console.error('📱 Index: Error accessing RBAC context:', error);
    // Continue with all permissions allowed for now
  }

  console.log('📱 Index: isMobile:', isMobile);
  console.log('📱 Index: Checking permissions and routes...');

  return (
    <>
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
                    <Route path="/vans/*" element={<Vans />} />
                    <Route path="/users" element={
                      hasPermission('users:read') ? <Users /> : <div>Access Denied</div>
                    } />
                    <Route path="/trip-logger" element={<TripLoggerPage />} />
                    <Route path="/trip-history" element={<TripHistoryPage />} />
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

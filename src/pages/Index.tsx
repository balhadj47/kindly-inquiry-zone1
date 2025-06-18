
import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useRBAC } from '@/contexts/RBACContext';
import { useIsMobile } from '@/hooks/use-mobile';
import AppSidebar from '@/components/AppSidebar';
import TopBar from '@/components/TopBar';
import MobileBottomNav from '@/components/MobileBottomNav';
import Dashboard from '@/components/Dashboard';
import Companies from '@/components/Companies';
import Vans from '@/components/Vans';
import Users from '@/components/Users';
import TripLogger from '@/components/TripLogger';
import TripHistory from '@/components/TripHistory';
import UserSettings from '@/pages/UserSettings';

const Index = () => {
  console.log('📱 Index: Rendering main app...');
  
  const isMobile = useIsMobile();
  
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

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full overflow-hidden">
        {!isMobile && <AppSidebar />}
        
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-200 h-screen">
          <TopBar />
          <main className={`flex-1 bg-gray-50 overflow-y-auto overflow-x-hidden ${
            isMobile ? 'p-3 pb-20' : 'p-3 sm:p-4 lg:p-6'
          }`}>
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
          </main>
        </div>
        
        {isMobile && <MobileBottomNav />}
      </div>
    </SidebarProvider>
  );
};

export default Index;

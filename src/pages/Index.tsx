
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

const AppContent = () => {
  console.log('📱 AppContent: Rendering...');
  
  let hasPermission;
  try {
    const rbacContext = useRBAC();
    hasPermission = rbacContext.hasPermission;
    console.log('📱 AppContent: RBAC context loaded successfully');
  } catch (error) {
    console.error('📱 AppContent: Error accessing RBAC context:', error);
    // Fallback: assume no permissions
    hasPermission = () => false;
  }
  
  const isMobile = useIsMobile();
  console.log('📱 AppContent: isMobile:', isMobile);

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full overflow-hidden">
        {/* Hide sidebar on mobile since we're using bottom nav */}
        {!isMobile && <AppSidebar />}
        
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-200 h-screen">
          <TopBar />
          <main className={`flex-1 bg-gray-50 overflow-y-auto overflow-x-hidden ${
            isMobile ? 'p-3 pb-20' : 'p-3 sm:p-4 lg:p-6'
          }`}>
            <div>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                {hasPermission('companies:read') && (
                  <Route path="/companies/*" element={<Companies />} />
                )}
                {hasPermission('vans:read') && (
                  <Route path="/vans" element={<Vans />} />
                )}
                {hasPermission('users:read') && (
                  <Route path="/users" element={<Users />} />
                )}
                {hasPermission('trips:read') && (
                  <>
                    <Route path="/trip-logger" element={<TripLogger />} />
                    <Route path="/trip-history" element={<TripHistory />} />
                  </>
                )}
                <Route path="/settings" element={<UserSettings />} />
              </Routes>
            </div>
          </main>
        </div>
        
        {/* Mobile bottom navigation */}
        {isMobile && <MobileBottomNav />}
      </div>
    </SidebarProvider>
  );
};

const Index = () => {
  console.log('📱 Index: Rendering...');
  return <AppContent />;
};

export default Index;

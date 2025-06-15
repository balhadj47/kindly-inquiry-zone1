
import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useRBAC } from '@/contexts/RBACContext';
import AppSidebar from '@/components/AppSidebar';
import TopBar from '@/components/TopBar';
import Dashboard from '@/components/Dashboard';
import Companies from '@/components/Companies';
import Vans from '@/components/Vans';
import Users from '@/components/Users';
import TripLogger from '@/components/TripLogger';
import TripHistory from '@/components/TripHistory';
import UserSettings from '@/pages/UserSettings';

const AppContent = () => {
  const { hasPermission } = useRBAC();

  // Removed loading check - render immediately
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 p-6 bg-gray-50">
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
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const Index = () => {
  return <AppContent />;
};

export default Index;

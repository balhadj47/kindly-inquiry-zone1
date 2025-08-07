
import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TripProvider } from '@/contexts/TripContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleData } from '@/hooks/useRoleData';
import AppSidebar from '@/components/AppSidebar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SafeComponent } from '@/components/SafeComponent';

// Lazy load pages
const MissionsPage = React.lazy(() => import('./MissionsPage'));

const Index = () => {
  const { user } = useAuth();
  const { roleName } = useRoleData(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <LanguageProvider>
      <TripProvider>
        <TooltipProvider>
          <div className="flex h-screen bg-gray-100">
            <ErrorBoundary>
              {/* Desktop Sidebar */}
              <div className="hidden md:flex">
                <AppSidebar />
              </div>
              
              {/* Main Content */}
              <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
                <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  }>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route 
                        path="/dashboard" 
                        element={
                          <SafeComponent>
                            <div className="text-center py-8">
                              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                              <p className="text-gray-600 mt-2">Welcome to your dashboard</p>
                            </div>
                          </SafeComponent>
                        } 
                      />
                      <Route 
                        path="/missions" 
                        element={
                          <SafeComponent>
                            <MissionsPage />
                          </SafeComponent>
                        } 
                      />
                      <Route 
                        path="/vans" 
                        element={
                          <SafeComponent>
                            <div className="text-center py-8">
                              <h1 className="text-2xl font-bold text-gray-900">Vans</h1>
                              <p className="text-gray-600 mt-2">Vans page coming soon</p>
                            </div>
                          </SafeComponent>
                        } 
                      />
                      <Route 
                        path="/companies" 
                        element={
                          <SafeComponent>
                            <div className="text-center py-8">
                              <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
                              <p className="text-gray-600 mt-2">Companies page coming soon</p>
                            </div>
                          </SafeComponent>
                        } 
                      />
                      <Route 
                        path="/users" 
                        element={
                          <SafeComponent>
                            <div className="text-center py-8">
                              <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                              <p className="text-gray-600 mt-2">Users page coming soon</p>
                            </div>
                          </SafeComponent>
                        } 
                      />
                      <Route 
                        path="/reports" 
                        element={
                          <SafeComponent>
                            <div className="text-center py-8">
                              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                              <p className="text-gray-600 mt-2">Reports page coming soon</p>
                            </div>
                          </SafeComponent>
                        } 
                      />
                      <Route 
                        path="/settings" 
                        element={
                          <SafeComponent>
                            <div className="text-center py-8">
                              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                              <p className="text-gray-600 mt-2">Settings page coming soon</p>
                            </div>
                          </SafeComponent>
                        } 
                      />
                    </Routes>
                  </Suspense>
                </div>
              </main>
            </ErrorBoundary>
          </div>
        </TooltipProvider>
      </TripProvider>
    </LanguageProvider>
  );
};

export default Index;

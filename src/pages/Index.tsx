
import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TripProvider } from '@/contexts/TripContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleData } from '@/hooks/useRoleData';
import { useLanguage } from '@/contexts/LanguageContext';
import Sidebar from '@/components/Sidebar';
import MobileSidebar from '@/components/MobileSidebar';
import TopBar from '@/components/TopBar';
import ErrorBoundary from '@/components/ErrorBoundary';
import SafeComponent from '@/components/SafeComponent';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load pages
const DashboardPage = React.lazy(() => import('./DashboardPage'));
const MissionsPage = React.lazy(() => import('./MissionsPage'));
const VansPage = React.lazy(() => import('./VansPage'));
const CompaniesPage = React.lazy(() => import('./CompaniesPage'));
const UsersPage = React.lazy(() => import('./UsersPage'));
const ReportsPage = React.lazy(() => import('./ReportsPage'));
const SettingsPage = React.lazy(() => import('./SettingsPage'));

const Index = () => {
  const { user, isAuthenticated } = useAuth();
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

  if (!isAuthenticated) {
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
                <Sidebar />
              </div>
              
              {/* Mobile Sidebar */}
              <MobileSidebar 
                isOpen={sidebarOpen} 
                onToggle={toggleSidebar}
              />
              
              {/* Main Content */}
              <main className="flex-1 flex flex-col overflow-hidden">
                <TopBar 
                  user={user}
                  roleName={roleName}
                  onMobileMenuToggle={toggleSidebar}
                  isMobile={isMobile}
                />
                
                <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
                  <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route 
                        path="/dashboard" 
                        element={
                          <SafeComponent>
                            <DashboardPage />
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
                            <VansPage />
                          </SafeComponent>
                        } 
                      />
                      <Route 
                        path="/companies" 
                        element={
                          <SafeComponent>
                            <CompaniesPage />
                          </SafeComponent>
                        } 
                      />
                      <Route 
                        path="/users" 
                        element={
                          <SafeComponent>
                            <UsersPage />
                          </SafeComponent>
                        } 
                      />
                      <Route 
                        path="/reports" 
                        element={
                          <SafeComponent>
                            <ReportsPage />
                          </SafeComponent>
                        } 
                      />
                      <Route 
                        path="/settings" 
                        element={
                          <SafeComponent>
                            <SettingsPage />
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

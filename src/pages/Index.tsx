
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TripProvider } from '@/contexts/TripContext';
import { useAuth } from '@/contexts/AuthContext';
import AppSidebar from '@/components/AppSidebar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SafeComponent } from '@/components/SafeComponent';

// Lazy load pages
const MissionsPage = React.lazy(() => import('./MissionsPage'));

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <LanguageProvider>
      <TripProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <ErrorBoundary>
              <AppSidebar />
              
              <SidebarInset>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
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
                        path="/employees" 
                        element={
                          <SafeComponent>
                            <div className="text-center py-8">
                              <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
                              <p className="text-gray-600 mt-2">Employees page coming soon</p>
                            </div>
                          </SafeComponent>
                        } 
                      />
                      <Route 
                        path="/auth-users" 
                        element={
                          <SafeComponent>
                            <div className="text-center py-8">
                              <h1 className="text-2xl font-bold text-gray-900">Auth Users</h1>
                              <p className="text-gray-600 mt-2">Auth Users page coming soon</p>
                            </div>
                          </SafeComponent>
                        } 
                      />
                    </Routes>
                  </Suspense>
                </main>
              </SidebarInset>
            </ErrorBoundary>
          </div>
        </SidebarProvider>
      </TripProvider>
    </LanguageProvider>
  );
};

export default Index;

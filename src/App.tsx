
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { RBACProvider } from '@/contexts/RBACContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TripProvider } from '@/contexts/TripContext';
import { ProgressiveLoadingProvider } from '@/contexts/ProgressiveLoadingContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorTracker from '@/components/ErrorTracker';
import ProtectedRoute from '@/components/ProtectedRoute';
import Index from '@/pages/Index';
import AuthPage from '@/pages/AuthPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  console.log('🚀 App: Starting application with hash-based routing...');
  
  return (
    <ErrorBoundary>
      <ErrorTracker />
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <AuthProvider>
            <LanguageProvider>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <RBACProvider>
                      <TripProvider>
                        <ProgressiveLoadingProvider>
                          <Index />
                        </ProgressiveLoadingProvider>
                      </TripProvider>
                    </RBACProvider>
                  </ProtectedRoute>
                } />
              </Routes>
            </LanguageProvider>
          </AuthProvider>
        </HashRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

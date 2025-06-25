
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { RBACProvider } from '@/contexts/RBACContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProgressiveLoadingProvider } from '@/contexts/ProgressiveLoadingContext';
import { TripProvider } from '@/contexts/TripContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import Index from '@/pages/Index';

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
  console.log('🚀 App: Starting application...');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <LanguageProvider>
              <RBACProvider>
                <ProgressiveLoadingProvider>
                  <TripProvider>
                    <Index />
                  </TripProvider>
                </ProgressiveLoadingProvider>
              </RBACProvider>
            </LanguageProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

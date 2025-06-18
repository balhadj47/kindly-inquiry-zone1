
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { RBACProvider } from "@/contexts/RBACContext";
import { TripProvider } from "@/contexts/TripContext";
import { ProgressiveLoadingProvider } from "@/contexts/ProgressiveLoadingContext";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load main components
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Optimize QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppLoadingSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="space-y-4 text-center">
      <Skeleton className="h-8 w-32 mx-auto" />
      <Skeleton className="h-4 w-48 mx-auto" />
      <div className="flex space-x-2 justify-center">
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-2 w-2 rounded-full" />
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isReactReady, setIsReactReady] = useState(false);

  useEffect(() => {
    console.log('🚀 App: Checking React readiness...');
    
    // More comprehensive React readiness check
    const checkReactReadiness = () => {
      try {
        // Check if React object exists and has required methods
        if (
          React && 
          typeof React === 'object' &&
          typeof React.useState === 'function' &&
          typeof React.useEffect === 'function' &&
          typeof React.useContext === 'function' &&
          typeof React.createElement === 'function'
        ) {
          console.log('🚀 App: React fully ready, setting state...');
          setIsReactReady(true);
          return true;
        }
        return false;
      } catch (error) {
        console.error('🚀 App: Error checking React readiness:', error);
        return false;
      }
    };

    // Try immediate check first
    if (checkReactReadiness()) {
      return;
    }

    // If not ready, use multiple fallback timers
    const timers: NodeJS.Timeout[] = [];
    
    // Try again after a short delay
    timers.push(setTimeout(() => {
      if (!checkReactReadiness()) {
        console.log('🚀 App: React still not ready after 100ms, waiting longer...');
      }
    }, 100));
    
    // Fallback after more time
    timers.push(setTimeout(() => {
      if (!checkReactReadiness()) {
        console.log('🚀 App: React still not ready after 300ms, forcing ready state...');
        setIsReactReady(true);
      }
    }, 300));

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  if (!isReactReady) {
    console.log('🚀 App: React not ready yet, showing skeleton...');
    return <AppLoadingSkeleton />;
  }

  console.log('🚀 App: React ready, rendering main application...');

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <LanguageProvider>
              <RBACProvider>
                <TripProvider>
                  <ProgressiveLoadingProvider>
                    <Suspense fallback={<AppLoadingSkeleton />}>
                      <Routes>
                        <Route path="/*" element={<Index />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </ProgressiveLoadingProvider>
                </TripProvider>
              </RBACProvider>
            </LanguageProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;

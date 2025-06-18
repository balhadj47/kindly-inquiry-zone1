
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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('🚀 App: Initializing...');
    
    // Ensure React and DOM are fully ready
    const initTimer = setTimeout(() => {
      // Verify React hooks are available
      if (typeof React.useState === 'function' && typeof React.useContext === 'function') {
        setIsReady(true);
        console.log('🚀 App: React fully initialized and ready');
      } else {
        console.warn('🚀 App: React hooks not ready, retrying...');
        // Retry after a bit more time
        setTimeout(() => setIsReady(true), 200);
      }
    }, 150);

    return () => clearTimeout(initTimer);
  }, []);

  if (!isReady) {
    console.log('🚀 App: Still initializing, showing skeleton...');
    return <AppLoadingSkeleton />;
  }

  console.log('🚀 App: Ready, rendering main application...');

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

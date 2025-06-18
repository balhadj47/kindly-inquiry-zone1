
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { RBACProvider } from "@/contexts/RBACContext";
import { TripProvider } from "@/contexts/TripContext";
import { ProgressiveLoadingProvider } from "@/contexts/ProgressiveLoadingContext";
import { Skeleton } from "@/components/ui/skeleton";
import NetworkStatus from "@/components/NetworkStatus";
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

// Main app component that only renders after React is ready
const MainApp: React.FC = () => {
  if (import.meta.env.DEV) {
    console.log('🚀 MainApp: Rendering main application...');
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <NetworkStatus />
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

const App: React.FC = () => {
  const [isReactInitialized, setIsReactInitialized] = useState(false);

  useEffect(() => {
    // Ensure React and all its internals are fully loaded before rendering
    const initializeApp = () => {
      // Double-check that React hooks are available
      if (typeof React.useState !== 'undefined' && typeof React.useContext !== 'undefined') {
        setIsReactInitialized(true);
        if (import.meta.env.DEV) {
          console.log('🚀 App: React fully initialized, rendering app...');
        }
      } else {
        // Retry if React isn't ready yet
        setTimeout(initializeApp, 100);
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      setTimeout(initializeApp, 200);
    });
  }, []);

  if (!isReactInitialized) {
    return <AppLoadingSkeleton />;
  }

  return <MainApp />;
};

export default App;

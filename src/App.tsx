
import React, { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { RBACProvider } from "@/contexts/RBACContext";
import { RBACDebugProvider } from "@/contexts/rbac/RBACDebugProvider";
import { TripProvider } from "@/contexts/TripContext";
import { ProgressiveLoadingProvider } from "@/contexts/ProgressiveLoadingContext";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "@/components/ErrorBoundary";
import NetworkStatusSimple from "@/components/NetworkStatusSimple";
import ProtectedRoute from "@/components/ProtectedRoute";

// Validate React is available
if (!React || !React.Suspense || !React.lazy) {
  console.error('❌ CRITICAL: React not properly available in App');
  throw new Error('React not available in App component');
}

// Lazy load main components
const Index = lazy(() => import("./pages/Index"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
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

const App = () => {
  console.log('🚀 App: Starting application render');
  
  // Validate React hooks are working
  try {
    const [isReady, setIsReady] = React.useState(false);
    
    React.useEffect(() => {
      console.log('🚀 App: useEffect working correctly');
      // Small delay to ensure React is fully initialized
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }, []);
    
    if (!isReady) {
      console.log('🚀 App: Waiting for React initialization...');
      return <AppLoadingSkeleton />;
    }
    
    console.log('🚀 App: React initialized, rendering main app');
    
    return (
      <ErrorBoundary>
        <NetworkStatusSimple>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <AuthProvider>
                <LanguageProvider>
                  <RBACDebugProvider>
                    <RBACProvider>
                      <TripProvider>
                        <ProgressiveLoadingProvider>
                          <Suspense fallback={<AppLoadingSkeleton />}>
                            <Routes>
                              <Route path="/auth" element={<AuthPage />} />
                              <Route path="/*" element={
                                <ProtectedRoute>
                                  <Index />
                                </ProtectedRoute>
                              } />
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </Suspense>
                        </ProgressiveLoadingProvider>
                      </TripProvider>
                    </RBACProvider>
                  </RBACDebugProvider>
                </LanguageProvider>
              </AuthProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </NetworkStatusSimple>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('❌ CRITICAL: App component error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">React Error</h1>
          <p className="text-gray-600 mb-4">React hooks are not available. Please reload the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
};

export default App;

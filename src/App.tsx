
import React, { Suspense, lazy } from 'react';
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

// Pure JavaScript React readiness check without hooks
let reactReady = false;
let appRender: () => void;

const checkReactReadiness = () => {
  try {
    if (
      React && 
      typeof React === 'object' &&
      typeof React.useState === 'function' &&
      typeof React.useEffect === 'function' &&
      typeof React.useContext === 'function' &&
      typeof React.createElement === 'function'
    ) {
      console.log('🚀 App: React fully ready');
      reactReady = true;
      if (appRender) appRender();
      return true;
    }
    return false;
  } catch (error) {
    console.error('🚀 App: Error checking React readiness:', error);
    return false;
  }
};

class App extends React.Component {
  constructor(props: {}) {
    super(props);
    this.state = { ready: false };
    console.log('🚀 App: Component constructor');
  }

  componentDidMount() {
    console.log('🚀 App: Component mounted, checking React readiness...');
    
    appRender = () => {
      this.setState({ ready: true });
    };

    // Try immediate check
    if (checkReactReadiness()) {
      return;
    }

    // Fallback timers
    setTimeout(() => {
      if (!checkReactReadiness()) {
        console.log('🚀 App: React still not ready after 100ms, waiting longer...');
      }
    }, 100);
    
    setTimeout(() => {
      if (!checkReactReadiness()) {
        console.log('🚀 App: React still not ready after 300ms, forcing ready state...');
        reactReady = true;
        this.setState({ ready: true });
      }
    }, 300);
  }

  render() {
    if (!(this.state as any).ready || !reactReady) {
      console.log('🚀 App: React not ready yet, showing skeleton...');
      return React.createElement(AppLoadingSkeleton);
    }

    console.log('🚀 App: React ready, rendering main application...');

    return React.createElement(
      ErrorBoundary,
      null,
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        React.createElement(
          BrowserRouter,
          null,
          React.createElement(
            AuthProvider,
            null,
            React.createElement(
              LanguageProvider,
              null,
              React.createElement(
                RBACProvider,
                null,
                React.createElement(
                  TripProvider,
                  null,
                  React.createElement(
                    ProgressiveLoadingProvider,
                    null,
                    React.createElement(
                      Suspense,
                      { fallback: React.createElement(AppLoadingSkeleton) },
                      React.createElement(
                        Routes,
                        null,
                        React.createElement(Route, { path: "/*", element: React.createElement(Index) }),
                        React.createElement(Route, { path: "*", element: React.createElement(NotFound) })
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    );
  }
}

export default App;

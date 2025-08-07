
import { StrictMode } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { RBACProvider } from '@/contexts/RBACContext';
import LoginPage from '@/pages/LoginPage';
import Index from '@/pages/Index';
import ProtectedRoute from '@/components/ProtectedRoute';

// Create a stable query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Router>
            <AuthProvider>
              <RBACProvider>
                <div className="min-h-screen bg-background">
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route 
                      path="/*" 
                      element={
                        <ProtectedRoute>
                          <Index />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                  <Toaster />
                </div>
              </RBACProvider>
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;

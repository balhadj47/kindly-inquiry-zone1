
import { Toaster } from "@/components/ui/toaster"
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import { RBACProvider } from '@/contexts/RBACContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { TripProvider } from '@/contexts/TripContext'
import { ProgressiveLoadingProvider } from '@/contexts/ProgressiveLoadingContext'
import { ThemeProvider } from "next-themes"
import { SidebarProvider } from "@/components/ui/sidebar"
import ProtectedRoute from '@/components/ProtectedRoute'
import Index from '@/pages/Index'
import AuthPage from '@/pages/AuthPage'
import NotFound from '@/pages/NotFound'
import './App.css'
import { useEffect } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

// Component to force light theme
const ThemeForcer = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Clear any stored theme preference
    localStorage.removeItem('app-theme');
    
    // Force light theme on document
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    document.documentElement.setAttribute('data-theme', 'light');
    
    console.log('🎨 Forced light theme applied');
  }, []);

  return <>{children}</>;
};

const App = () => {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="light" 
      enableSystem={false}
      forcedTheme="light"
      storageKey="app-theme-disabled"
    >
      <ThemeForcer>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <AuthProvider>
              <RBACProvider>
                <ProgressiveLoadingProvider>
                  <TripProvider>
                    <Router>
                      <Routes>
                        <Route path="auth" element={<AuthPage />} />
                        <Route path="*" element={
                          <ProtectedRoute>
                            <SidebarProvider>
                              <Index />
                            </SidebarProvider>
                          </ProtectedRoute>
                        } />
                      </Routes>
                    </Router>
                  </TripProvider>
                </ProgressiveLoadingProvider>
              </RBACProvider>
            </AuthProvider>
          </LanguageProvider>
        </QueryClientProvider>
        <Toaster />
      </ThemeForcer>
    </ThemeProvider>
  )
}

export default App

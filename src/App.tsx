
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
    </ThemeProvider>
  )
}

export default App

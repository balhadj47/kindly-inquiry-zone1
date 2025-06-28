
import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/contexts/AuthContext'
import { RBACProvider } from '@/contexts/RBACContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { TripProvider } from '@/contexts/TripContext'
import { ProgressiveLoadingProvider } from '@/contexts/ProgressiveLoadingContext'
import { ThemeProvider } from "next-themes"
import { SidebarProvider } from "@/components/ui/sidebar"
import ErrorBoundary from '@/components/ErrorBoundary'
import ProtectedRoute from '@/components/ProtectedRoute'
import Index from '@/pages/Index'
import TripLoggerPage from '@/pages/TripLoggerPage'
import TripHistoryPage from '@/pages/TripHistoryPage'
import AuthPage from '@/pages/AuthPage'
import MissionsPage from '@/pages/MissionsPage'
import AuthUsersPage from '@/pages/AuthUsersPage'
import UserSettings from '@/pages/UserSettings'
import SystemSettingsPage from '@/pages/SystemSettingsPage'
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
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <AuthProvider>
              <RBACProvider>
                <ProgressiveLoadingProvider>
                  <TripProvider>
                    <SidebarProvider>
                      <Router>
                        <Routes>
                          <Route path="/auth" element={<AuthPage />} />
                          <Route path="/" element={
                            <ProtectedRoute>
                              <Index />
                            </ProtectedRoute>
                          } />
                          <Route path="/trip-logger" element={
                            <ProtectedRoute>
                              <TripLoggerPage />
                            </ProtectedRoute>
                          } />
                          <Route path="/trip-history" element={
                            <ProtectedRoute>
                              <TripHistoryPage />
                            </ProtectedRoute>
                          } />
                          <Route path="/missions" element={
                            <ProtectedRoute>
                              <MissionsPage />
                            </ProtectedRoute>
                          } />
                          <Route path="/auth-users" element={
                            <ProtectedRoute>
                              <AuthUsersPage />
                            </ProtectedRoute>
                          } />
                          <Route path="/user-settings" element={
                            <ProtectedRoute>
                              <UserSettings />
                            </ProtectedRoute>
                          } />
                          <Route path="/system-settings" element={
                            <ProtectedRoute>
                              <SystemSettingsPage />
                            </ProtectedRoute>
                          } />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Router>
                    </SidebarProvider>
                  </TripProvider>
                </ProgressiveLoadingProvider>
              </RBACProvider>
            </AuthProvider>
          </LanguageProvider>
        </QueryClientProvider>
        <Toaster />
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App

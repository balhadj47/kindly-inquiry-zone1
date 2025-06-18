
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { RBACProvider } from "@/contexts/RBACContext";
import { TripProvider } from "@/contexts/TripContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UserSettings from "./pages/UserSettings";

const queryClient = new QueryClient();

const App = () => {
  console.log('🚀 App: Starting application...');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <LanguageProvider>
              <RBACProvider>
                <TripProvider>
                  <Routes>
                    <Route path="/*" element={<Index />} />
                    <Route path="/user-settings" element={<UserSettings />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </TripProvider>
              </RBACProvider>
            </LanguageProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

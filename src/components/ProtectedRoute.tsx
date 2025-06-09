
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

console.log('🛡️ ProtectedRoute: Component loading...');

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  console.log('🛡️ ProtectedRoute: Component rendering...');
  
  const { user, loading } = useAuth();

  console.log('🛡️ ProtectedRoute: Auth state - user:', user, 'loading:', loading);

  if (loading) {
    console.log('🛡️ ProtectedRoute: Showing loading state...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    console.log('🛡️ ProtectedRoute: No user, redirecting to auth...');
    return <Navigate to="/auth" replace />;
  }

  console.log('🛡️ ProtectedRoute: User authenticated, rendering children...');
  return <>{children}</>;
};

console.log('🛡️ ProtectedRoute: Component defined, exporting...');

export default ProtectedRoute;

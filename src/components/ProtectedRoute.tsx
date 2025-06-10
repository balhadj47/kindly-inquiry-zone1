
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

console.log('🛡️ ProtectedRoute: Component loading...');

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  console.log('🛡️ ProtectedRoute: Component rendering...');
  
  const { user, loading } = useAuth();

  console.log('🛡️ ProtectedRoute: Auth state - user:', user, 'loading:', loading);

  // Skip loading state - render immediately based on user presence
  if (!user && !loading) {
    console.log('🛡️ ProtectedRoute: No user, redirecting to auth...');
    return <Navigate to="/auth" replace />;
  }

  console.log('🛡️ ProtectedRoute: User authenticated or loading, rendering children...');
  return <>{children}</>;
};

console.log('🛡️ ProtectedRoute: Component defined, exporting...');

export default ProtectedRoute;

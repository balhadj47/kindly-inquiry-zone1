
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('🛡️ ProtectedRoute: Auth check:', {
    user: user?.email || 'null',
    loading,
    timestamp: new Date().toISOString()
  });

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div>Chargement...</div>
        </div>
      </div>
    );
  }

  // If no user, redirect to auth page
  if (!user) {
    console.log('🛡️ ProtectedRoute: No user found, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('🛡️ ProtectedRoute: User authenticated, rendering children');
  // User is authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;

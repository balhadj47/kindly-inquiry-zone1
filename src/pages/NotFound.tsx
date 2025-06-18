
import { useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // If still loading auth state, wait
  if (loading) {
    return null;
  }

  // If no user is authenticated, redirect to auth page
  if (!user) {
    console.log("404: Redirecting unauthenticated user to auth page");
    return <Navigate to="/auth" replace />;
  }

  // If user is authenticated but page not found, redirect to dashboard
  console.log("404: Redirecting authenticated user to dashboard");
  return <Navigate to="/dashboard" replace />;
};

export default NotFound;

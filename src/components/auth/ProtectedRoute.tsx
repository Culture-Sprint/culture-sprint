
import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowPublic?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowPublic = false }) => {
  const { user, loading, isPublicRoute } = useAuth();
  const location = useLocation();
  
  // Check if this route should be publicly accessible
  const isPublicSubmissionRoute = isPublicRoute();
  
  // Check if this is a public dashboard route with a valid token
  const isPublicDashboardRoute = location.pathname.startsWith('/public-dashboard/') && 
                               location.pathname.length > 17;
                                
  // Enhanced logging for public dashboard routes
  if (isPublicDashboardRoute) {
    const token = location.pathname.replace('/public-dashboard/', '');
    console.log("Public dashboard access with token:", token);
  }
  
  console.log("Route access check:", {
    path: location.pathname,
    isPublicDashboardRoute,
    isPublicSubmissionRoute,
    allowPublic,
    user: user ? "Authenticated" : "Not authenticated"
  });
  
  // If this is explicitly a public route or it's been marked as allowing public access, allow access
  if (allowPublic || isPublicSubmissionRoute || isPublicDashboardRoute) {
    console.log("Allowing access to public route:", location.pathname);
    return <>{children || <Outlet />}</>;
  }

  if (loading) {
    // You could show a loading spinner here
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    // Redirect to the auth page if the user is not logged in
    console.log("No authenticated user, redirecting to auth");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;

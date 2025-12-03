import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ProfileMissingFix } from "./ProfileMissingFix";

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  hasProfile?: boolean;
  requiredRole?: "end-user" | "accountant" | "admin" | null;
  userRole?: "end-user" | "accountant" | "admin" | null;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isAuthenticated,
  hasProfile = true,
  requiredRole,
  userRole,
  redirectTo = "/login",
}) => {
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has a profile
  if (isAuthenticated && !hasProfile) {
    return <ProfileMissingFix />;
  }

  // Check role-based access if requiredRole is specified
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    if (userRole === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard/overview" replace />;
  }

  return <>{children}</>;
};
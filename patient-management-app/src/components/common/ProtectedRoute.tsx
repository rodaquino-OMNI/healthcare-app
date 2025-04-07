import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string; // Optional: role-based access control
}

/**
 * A wrapper component that redirects to login page if user is not authenticated
 * Also supports optional role-based access control
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while authenticating
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Authenticating...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    // Save the attempted URL for redirecting after successful login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role-based access control is required
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  // If authenticated and has right permissions, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
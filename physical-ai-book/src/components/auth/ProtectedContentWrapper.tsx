import React from 'react';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedContentWrapperProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallback?: React.ReactNode;
  redirectPath?: string;
  contentId?: string;
}

const ProtectedContentWrapper: React.FC<ProtectedContentWrapperProps> = ({
  children,
  requiredRole = 'authenticated',
  fallback,
  redirectPath = '/signin',
  contentId
}) => {
  const { user, loading, isAuthenticated } = useAuth();

  // If content requires authentication, use ProtectedRoute
  if (requiredRole === 'authenticated' || requiredRole === 'premium') {
    return (
      <ProtectedRoute
        requiredRole={requiredRole}
        fallback={fallback}
        redirectPath={redirectPath}
      >
        {children}
      </ProtectedRoute>
    );
  }

  // If content requires a specific role
  if (requiredRole && requiredRole !== 'anonymous') {
    return (
      <ProtectedRoute
        requiredRole={requiredRole}
        fallback={fallback}
        redirectPath={redirectPath}
      >
        {children}
      </ProtectedRoute>
    );
  }

  // If no special access is required, render the content directly
  return <>{children}</>;
};

export default ProtectedContentWrapper;
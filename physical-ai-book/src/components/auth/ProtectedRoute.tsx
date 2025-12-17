import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { constructAuthUrlWithReturn } from '../../utils/returnUrlUtils'
import { ContentAccessService } from '../../services/content-access'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
  requiredAccessLevel?: 'view' | 'edit' | 'admin'
  contentId?: string
  fallback?: React.ReactNode
  redirectPath?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'authenticated',
  requiredAccessLevel = 'view',
  contentId,
  fallback = <div>Please log in to access this content.</div>,
  redirectPath = '/signin'
}) => {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    // For Docusaurus, we'll render a message with a link to sign in
    return fallback || (
      <div>
        Please <a href={constructAuthUrlWithReturn(redirectPath)}>log in</a> to access this content.
      </div>
    )
  }

  // Check role-based access if required
  if (requiredRole && requiredRole !== 'authenticated') {
    // Check for admin access
    if (requiredRole === 'admin' && !ContentAccessService.isAdmin(user)) {
      return <div>You don't have administrator permission to access this content.</div>
    }

    // Check for premium access
    if (requiredRole === 'premium' && !ContentAccessService.hasPremiumAccess(user)) {
      return <div>You need a premium account to access this content.</div>
    }

    // Check for instructor access
    if (requiredRole === 'instructor' && !ContentAccessService.hasInstructorAccess(user)) {
      return <div>You need instructor access to view this content.</div>
    }

    // Check for specific role
    if (requiredRole !== 'admin' && requiredRole !== 'premium' && requiredRole !== 'instructor') {
      if (user.role !== requiredRole) {
        return <div>You don't have permission to access this content.</div>
      }
    }
  }

  // Check content-specific access if contentId is provided
  if (contentId && requiredAccessLevel) {
    // In a real implementation, we would check the user's access to the specific content
    // For now, we'll assume the user has access if they have the required role
  }

  // User is authenticated and has required role (if any)
  return <>{children}</>
}

export default ProtectedRoute
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ContentAccessService } from '../../services/content-access';
import { constructAuthUrlWithReturn } from '../../utils/returnUrlUtils';
import './PremiumContentIndicator.css';

interface PremiumContentIndicatorProps {
  children: React.ReactNode;
  message?: string;
  redirectPath?: string;
  requiredRole?: string;
  contentId?: string;
}

const PremiumContentIndicator: React.FC<PremiumContentIndicatorProps> = ({
  children,
  message = 'This content is available to authenticated users only.',
  redirectPath = '/signin',
  requiredRole = 'authenticated',
  contentId
}) => {
  const { user, isAuthenticated } = useAuth();

  // Determine if user has access based on role and content requirements
  const hasAccess = isAuthenticated && (
    requiredRole === 'authenticated' ||
    (requiredRole === 'premium' && ContentAccessService.hasPremiumAccess(user)) ||
    (requiredRole === 'admin' && ContentAccessService.isAdmin(user)) ||
    (requiredRole === 'instructor' && ContentAccessService.hasInstructorAccess(user)) ||
    (requiredRole !== 'authenticated' && requiredRole !== 'premium' && requiredRole !== 'admin' && requiredRole !== 'instructor' && user?.role === requiredRole)
  );

  return (
    <div className={`premium-content-container ${hasAccess ? 'premium-content-accessible' : 'premium-content-locked'}`}>
      {!hasAccess && (
        <div className="premium-content-overlay">
          <div className="premium-content-message">
            <h3>🔒 Premium Content</h3>
            <p>{message}</p>
            <a
              href={constructAuthUrlWithReturn(redirectPath)}
              className="premium-content-signin-button button button--primary"
            >
              {requiredRole === 'premium' ? 'Upgrade to Premium' : 'Sign In to Access'}
            </a>
          </div>
        </div>
      )}
      <div className={`premium-content ${hasAccess ? 'premium-content-authenticated' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default PremiumContentIndicator;
import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../services/supabase';

interface ContentAccessMiddlewareProps {
  contentId: string;
  children: React.ReactNode;
  requiredAccessLevel?: 'view' | 'edit' | 'admin';
}

const ContentAccessMiddleware: React.FC<ContentAccessMiddlewareProps> = ({
  contentId,
  children,
  requiredAccessLevel = 'view'
}) => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Log content access for authenticated users
    if (isAuthenticated && user && contentId) {
      const logAccess = async () => {
        try {
          // This would log the access in a real implementation
          // For now, we'll just log to console
          console.log(`User ${user.id} accessed content ${contentId}`);

          // In a real implementation, you might want to track this in your database
          // await supabase.from('content_access').insert({
          //   user_id: user.id,
          //   content_id: contentId,
          //   access_level: requiredAccessLevel,
          //   accessed_at: new Date().toISOString()
          // });
        } catch (error) {
          console.error('Error logging content access:', error);
        }
      };

      logAccess();
    }
  }, [user, isAuthenticated, contentId, requiredAccessLevel]);

  // In a real implementation, you would check if the user has access to this content
  // For now, we're just returning the children
  // The actual access control is handled by ProtectedRoute

  return <>{children}</>;
};

export default ContentAccessMiddleware;
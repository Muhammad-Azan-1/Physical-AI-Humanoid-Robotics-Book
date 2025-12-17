import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ContentAccessService } from '../../services/content-access';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

interface DynamicContentLoaderProps {
  contentId: string;
  accessLevel?: 'view' | 'edit' | 'admin';
  renderContent: (data: any) => React.ReactNode;
  unauthorizedComponent?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

const DynamicContentLoader: React.FC<DynamicContentLoaderProps> = ({
  contentId,
  accessLevel = 'view',
  renderContent,
  unauthorizedComponent = <div>You don't have permission to access this content.</div>,
  loadingComponent = <LoadingSpinner centered message="Loading content..." />
}) => {
  const { user, isAuthenticated } = useAuth();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      if (!isAuthenticated || !user) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user has access to the content
        const access = await ContentAccessService.hasAccess(user.id, contentId, accessLevel);
        setHasAccess(access);

        if (access) {
          // In a real implementation, we would fetch the actual content from the server
          // For this example, we'll simulate fetching content
          // This would typically be an API call to fetch the protected content
          const fetchedContent = await fetchContent(contentId);
          setContent(fetchedContent);
        }
      } catch (err) {
        setError('Failed to load content. Please try again later.');
        console.error('Error loading content:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [contentId, accessLevel, isAuthenticated, user]);

  // Simulated content fetch function
  // In a real implementation, this would be an actual API call
  const fetchContent = async (id: string): Promise<any> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // This is a placeholder - in a real implementation, you would fetch content from your API
    return {
      id,
      title: `Protected Content ${id}`,
      body: `This is the protected content with ID ${id}. Only authorized users can see this.`,
      lastUpdated: new Date().toISOString()
    };
  };

  if (loading) {
    return loadingComponent;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!hasAccess) {
    return unauthorizedComponent;
  }

  if (content) {
    return renderContent(content);
  }

  return null;
};

export default DynamicContentLoader;
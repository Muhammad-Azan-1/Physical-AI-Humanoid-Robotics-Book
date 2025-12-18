import React, { useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getBroadcastChannelManager, CrossTabMessageType } from './BroadcastChannelManager';
import { AuthStateData } from './BroadcastChannelManager';

/**
 * AuthStateSync Component
 * Listens for cross-tab authentication changes and updates the local authentication state accordingly
 */
const AuthStateSync: React.FC = () => {
  const { user, session, isAuthenticated, signOut, setUser, setSession, setIsAuthenticated } = useAuth();
  const broadcastChannel = getBroadcastChannelManager();

  // Handle authentication state updates from other tabs
  const handleAuthUpdate = useCallback((data: AuthStateData) => {
    console.log('Received auth update from another tab:', data);

    // Update authentication state based on the received data
    setIsAuthenticated(data.isAuthenticated);

    if (data.user) {
      setUser(data.user);
    } else {
      setUser(null);
    }

    if (data.session) {
      setSession(data.session);
    } else {
      setSession(null);
    }
  }, [setUser, setSession, setIsAuthenticated]);

  // Handle logout from other tabs
  const handleLogout = useCallback(() => {
    console.log('Received logout notification from another tab');
    // Sign out the current session to sync with other tabs
    signOut().catch(error => {
      console.error('Error during cross-tab logout sync:', error);
    });
  }, [signOut]);

  // Handle token expiration from other tabs
  const handleTokenExpired = useCallback(() => {
    console.log('Received token expired notification from another tab');
    // Clear the current session to sync with other tabs
    signOut().catch(error => {
      console.error('Error during cross-tab token expiration sync:', error);
    });
  }, [signOut]);

  // Handle token refresh request from other tabs
  const handleTokenRefresh = useCallback(() => {
    console.log('Received token refresh request from another tab');
    // In a real implementation, this would trigger a token refresh
    // For now, we'll just log the event
  }, []);

  useEffect(() => {
    // Subscribe to cross-tab messages
    broadcastChannel.subscribe('AUTH_UPDATE', handleAuthUpdate);
    broadcastChannel.subscribe('LOGOUT', handleLogout);
    broadcastChannel.subscribe('TOKEN_EXPIRED', handleTokenExpired);
    broadcastChannel.subscribe('REFRESH_TOKEN', handleTokenRefresh);

    // Cleanup on unmount
    return () => {
      broadcastChannel.unsubscribe('AUTH_UPDATE', handleAuthUpdate);
      broadcastChannel.unsubscribe('LOGOUT', handleLogout);
      broadcastChannel.unsubscribe('TOKEN_EXPIRED', handleTokenExpired);
      broadcastChannel.unsubscribe('REFRESH_TOKEN', handleTokenRefresh);
    };
  }, [broadcastChannel, handleAuthUpdate, handleLogout, handleTokenExpired, handleTokenRefresh]);

  // Notify other tabs when authentication state changes locally
  useEffect(() => {
    const authState: AuthStateData = {
      isAuthenticated,
      user: user || undefined,
      session: session || undefined,
      emailVerified: user?.email_verified
    };

    // This would be called when the local auth state changes
    // In a real implementation, we'd have a more sophisticated way to detect changes
  }, [isAuthenticated, user, session]);

  return null; // This component doesn't render anything
};

export default AuthStateSync;
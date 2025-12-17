import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface UseSignOutProps {
  onSignOutComplete?: () => void;
}

export const useSignOutWithConfirmation = ({ onSignOutComplete }: UseSignOutProps = {}) => {
  const { signOut } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSignOut = useCallback(async () => {
    try {
      setIsProcessing(true);
      await signOut();
      toast.success('You\'ve been signed out successfully');
      setShowConfirmation(false);
      onSignOutComplete?.();
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [signOut, onSignOutComplete]);

  const initiateSignOut = useCallback(() => {
    setShowConfirmation(true);
  }, []);

  const cancelSignOut = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  return {
    showConfirmation,
    isProcessing,
    initiateSignOut,
    handleSignOut,
    cancelSignOut
  };
};
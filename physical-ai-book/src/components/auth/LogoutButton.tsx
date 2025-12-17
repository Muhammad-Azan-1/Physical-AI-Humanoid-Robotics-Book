import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSignOutWithConfirmation } from '../../hooks/useSignOutWithConfirmation';
import SignOutConfirmationDialog from './SignOutConfirmationDialog';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

interface LogoutButtonProps {
  onLogout?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  onLogout,
  children = 'Sign Out',
  className = 'button button--secondary'
}) => {
  const { signOut } = useAuth();

  const {
    showConfirmation,
    isProcessing,
    initiateSignOut,
    handleSignOut,
    cancelSignOut
  } = useSignOutWithConfirmation({
    onSignOutComplete: () => {
      // Call the callback if provided
      if (onLogout) {
        onLogout();
      }
    }
  });

  return (
    <>
      <div className="logout-button-container">
        <button
          type="button"
          className={className}
          onClick={initiateSignOut}
        >
          {children}
        </button>
      </div>

      <SignOutConfirmationDialog
        isOpen={showConfirmation}
        onClose={cancelSignOut}
        onConfirm={handleSignOut}
        loading={isProcessing}
      />
    </>
  );
};

export default LogoutButton;
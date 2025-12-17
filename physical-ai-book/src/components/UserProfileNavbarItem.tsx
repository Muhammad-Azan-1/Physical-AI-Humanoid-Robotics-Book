import React from 'react';
import { useAuth } from '@site/src/contexts/AuthContext';
import { useSignOutWithConfirmation } from '@site/src/hooks/useSignOutWithConfirmation';
import SignOutConfirmationDialog from '@site/src/components/auth/SignOutConfirmationDialog';
import styles from './AuthNavbarItem/AuthNavbarItem.module.css';

interface UserProfileNavbarItemProps {
    mobile?: boolean;
}

const UserProfileNavbarItem: React.FC<UserProfileNavbarItemProps> = ({ mobile = false }) => {
    const { user, isAuthenticated, signOut } = useAuth();

    const {
        showConfirmation,
        isProcessing,
        initiateSignOut,
        handleSignOut,
        cancelSignOut
    } = useSignOutWithConfirmation({
        onSignOutComplete: () => {
            window.location.href = '/Physical-AI-Humanoid-Robotics-Book/';
        }
    });

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <>
            <div className={`${styles.authContainer} ${mobile ? styles.mobile : ''}`}>
                <span className={styles.userEmail}>
                    {user.email?.split('@')[0] || 'User'}
                </span>
                <button
                    onClick={initiateSignOut}
                    className={`button button--sm ${styles.signOutButton}`}
                >
                    Sign Out
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

export default UserProfileNavbarItem;

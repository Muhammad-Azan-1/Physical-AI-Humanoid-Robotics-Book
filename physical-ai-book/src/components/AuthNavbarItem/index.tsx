import React from 'react';
import Link from '@docusaurus/Link';
import { useAuth } from '../../contexts/AuthContext';
import { useSignOutWithConfirmation } from '../../hooks/useSignOutWithConfirmation';
import SignOutConfirmationDialog from '../../components/auth/SignOutConfirmationDialog';
import { constructAuthUrlWithReturn } from '../../utils/returnUrlUtils';
import styles from './AuthNavbarItem.module.css';

interface AuthNavbarItemProps {
    mobile?: boolean;
}

const AuthNavbarItem: React.FC<AuthNavbarItemProps> = ({ mobile = false }) => {
    const { user, isAuthenticated, loading, signOut } = useAuth();

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

    if (loading) {
        return null; // Don't show anything while loading
    }

    if (isAuthenticated && user) {
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
    }

    return (
        <div className={`${styles.authContainer} ${mobile ? styles.mobile : ''}`}>
            <a
                href={constructAuthUrlWithReturn('/signin')}
                className="button button--secondary button--sm margin-right--sm"
            >
                Sign In
            </a>
            <a
                href={constructAuthUrlWithReturn('/signup')}
                className="button button--primary button--sm"
            >
                Sign Up
            </a>
        </div>
    );
};

export default AuthNavbarItem;

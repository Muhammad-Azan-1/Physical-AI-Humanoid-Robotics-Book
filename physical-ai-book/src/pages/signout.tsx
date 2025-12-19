import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '../contexts/AuthContext';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import '../components/auth/auth.css';

const SignoutPage: React.FC = () => {
    const { signOut, isAuthenticated } = useAuth();
    const { siteConfig } = useDocusaurusContext();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Signing out...');

    const homeUrl = siteConfig.baseUrl;
    const signinUrl = `${siteConfig.baseUrl}signin`;

    useEffect(() => {
        const handleSignOut = async () => {
            try {
                await signOut();
                setStatus('success');
                setMessage('You have been signed out successfully.');

                // Redirect to home after 2 seconds
                setTimeout(() => {
                    window.location.href = homeUrl;
                }, 2000);
            } catch (error: any) {
                console.error('Sign out error:', error);
                setStatus('error');
                setMessage(error.message || 'Failed to sign out. Please try again.');
            }
        };

        // Only sign out if user is authenticated
        if (isAuthenticated) {
            handleSignOut();
        } else {
            setStatus('success');
            setMessage('You are already signed out.');

            // Redirect to home after 2 seconds
            setTimeout(() => {
                window.location.href = homeUrl;
            }, 2000);
        }
    }, [isAuthenticated, signOut, homeUrl]);

    return (
        <Layout title="Sign Out" description="Sign out of your account">
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card">
                        <div className="auth-header" style={{ marginBottom: '16px' }}>
                            {status === 'loading' && (
                                <>
                                    <div className="auth-spinner" style={{
                                        width: '48px',
                                        height: '48px',
                                        margin: '0 auto 20px',
                                        borderWidth: '3px'
                                    }}></div>
                                    <h1>Signing Out</h1>
                                    <p>{message}</p>
                                </>
                            )}

                            {status === 'success' && (
                                <>
                                    <div className="auth-success-icon">👋</div>
                                    <h1>Goodbye!</h1>
                                    <p>{message}</p>
                                    <p style={{ fontSize: '14px', color: 'var(--ifm-font-color-secondary)', marginTop: '8px' }}>
                                        Redirecting to home page...
                                    </p>
                                </>
                            )}

                            {status === 'error' && (
                                <>
                                    <div style={{
                                        fontSize: '48px',
                                        marginBottom: '12px'
                                    }}>⚠️</div>
                                    <h1>Sign Out Failed</h1>
                                    <p>{message}</p>
                                </>
                            )}
                        </div>

                        {status !== 'loading' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button
                                    className="auth-submit-btn"
                                    onClick={() => window.location.href = homeUrl}
                                >
                                    Go to Home
                                </button>

                                {status === 'error' && (
                                    <button
                                        className="auth-secondary-btn"
                                        onClick={() => window.location.reload()}
                                    >
                                        Try Again
                                    </button>
                                )}

                                {status === 'success' && (
                                    <button
                                        className="auth-secondary-btn"
                                        onClick={() => window.location.href = signinUrl}
                                    >
                                        Sign In Again
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SignoutPage;

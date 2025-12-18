import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '../../hooks/useAuth';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { initializeSupabase } from '../../services/supabase';
import { getValidRedirectUrl } from '../../utils/authHelpers';
import { constructAuthUrlWithReturn } from '../../utils/returnUrlUtils';

const AuthCallbackPage: React.FC = () => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email...');
    const { siteConfig } = useDocusaurusContext();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Get Supabase credentials from Docusaurus customFields
                const customFields = siteConfig.customFields as { supabaseUrl?: string; supabaseAnonKey?: string } | undefined;
                const supabaseUrl = customFields?.supabaseUrl || '';
                const supabaseAnonKey = customFields?.supabaseAnonKey || '';

                if (!supabaseUrl || !supabaseAnonKey) {
                    setStatus('error');
                    setMessage('Authentication configuration is missing. Please contact support.');
                    return;
                }

                // Initialize Supabase
                const supabase = initializeSupabase({ url: supabaseUrl, anonKey: supabaseAnonKey });

                // Check if there's an error in the URL hash
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const error = hashParams.get('error');
                const errorDescription = hashParams.get('error_description');

                if (error) {
                    setStatus('error');
                    setMessage(errorDescription || 'An error occurred during email verification.');
                    return;
                }

                // Check for access_token in the hash (this is how Supabase returns the session)
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');

                if (accessToken && refreshToken) {
                    // Set the session from the URL tokens
                    const { data, error: sessionError } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken
                    });

                    if (sessionError) {
                        setStatus('error');
                        setMessage(sessionError.message || 'Failed to verify your session.');
                        return;
                    }

                    if (data.session) {
                        setStatus('success');
                        setMessage('Email verified successfully! You are now logged in.');

                        // Notify other tabs of the authentication update via localStorage event
                        const authState = {
                            event: 'SIGNED_IN',
                            session: data.session,
                            timestamp: Date.now(),
                        };
                        localStorage.setItem('auth-state', JSON.stringify(authState));

                        // Check for return URL in query parameters before redirecting
                        const urlParams = new URLSearchParams(window.location.search);
                        const returnUrl = urlParams.get('returnUrl');

                        // Get original destination from localStorage (if stored during signup)
                        const originalDestination = localStorage.getItem('original_destination');

                        // Use the original destination if available, otherwise use returnUrl, otherwise default to home
                        let redirectUrl = siteConfig.baseUrl; // default
                        if (originalDestination) {
                            redirectUrl = getValidRedirectUrl(originalDestination, siteConfig.baseUrl);
                            // Clear the stored destination after using it
                            localStorage.removeItem('original_destination');
                        } else if (returnUrl) {
                            redirectUrl = getValidRedirectUrl(decodeURIComponent(returnUrl), siteConfig.baseUrl);
                        }

                        // Redirect after a short delay
                        setTimeout(() => {
                            window.location.href = redirectUrl;
                        }, 2000);
                        return;
                    }
                }

                // Check for the type parameter (could be signup, recovery, etc.)
                const type = hashParams.get('type');

                if (type === 'signup' || type === 'email_change') {
                    // Check current session
                    const { data: { session } } = await supabase.auth.getSession();

                    if (session) {
                        setStatus('success');
                        setMessage('Email verified successfully! You are now logged in.');

                        // Notify other tabs of the authentication update via localStorage event
                        const authState = {
                            event: 'SIGNED_IN',
                            session: session,
                            timestamp: Date.now(),
                        };
                        localStorage.setItem('auth-state', JSON.stringify(authState));

                        // Check for return URL in query parameters before redirecting
                        const urlParams = new URLSearchParams(window.location.search);
                        const returnUrl = urlParams.get('returnUrl');

                        // Get original destination from localStorage (if stored during signup)
                        const originalDestination = localStorage.getItem('original_destination');

                        // Use the original destination if available, otherwise use returnUrl, otherwise default to home
                        let redirectUrl = siteConfig.baseUrl; // default
                        if (originalDestination) {
                            redirectUrl = getValidRedirectUrl(originalDestination, siteConfig.baseUrl);
                            // Clear the stored destination after using it
                            localStorage.removeItem('original_destination');
                        } else if (returnUrl) {
                            redirectUrl = getValidRedirectUrl(decodeURIComponent(returnUrl), siteConfig.baseUrl);
                        }

                        setTimeout(() => {
                            window.location.href = redirectUrl;
                        }, 2000);
                        return;
                    }
                }

                if (type === 'recovery') {
                    setStatus('success');
                    setMessage('Password reset verified! Redirecting to reset your password...');

                    // Use a safe redirect URL for password reset
                    const redirectUrl = getValidRedirectUrl(`${siteConfig.baseUrl}reset-password`, `${siteConfig.baseUrl}reset-password`);

                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 2000);
                    return;
                }

                // If we get here without tokens, try to get the existing session
                const { data: { session } } = await supabase.auth.getSession();

                if (session) {
                    setStatus('success');
                    setMessage('You are already logged in! Redirecting...');

                    // Check for return URL in query parameters before redirecting
                    const urlParams = new URLSearchParams(window.location.search);
                    const returnUrl = urlParams.get('returnUrl');
                    const redirectUrl = returnUrl ? getValidRedirectUrl(decodeURIComponent(returnUrl), siteConfig.baseUrl) : siteConfig.baseUrl;

                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 2000);
                } else {
                    // No session and no tokens - the verification link might have expired
                    setStatus('error');
                    setMessage('Unable to verify your session. The link may have expired. Please try signing in.');
                }
            } catch (err: any) {
                console.error('Auth callback error:', err);
                setStatus('error');
                setMessage(err.message || 'An unexpected error occurred during authentication.');
            }
        };

        handleAuthCallback();
    }, [siteConfig]);

    return (
        <Layout title="Email Verification" description="Email verification callback">
            <div className="container margin-vert--xl">
                <div className="row">
                    <div className="col col--6 col--offset-3">
                        <div className="card">
                            <div className="card__body" style={{ textAlign: 'center', padding: '3rem' }}>
                                {status === 'loading' && (
                                    <>
                                        <div className="loading-spinner" style={{
                                            width: '50px',
                                            height: '50px',
                                            border: '4px solid #f3f3f3',
                                            borderTop: '4px solid var(--ifm-color-primary)',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite',
                                            margin: '0 auto 1.5rem'
                                        }} />
                                        <style>{`
                      @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                      }
                    `}</style>
                                        <h2>Verifying...</h2>
                                        <p>{message}</p>
                                    </>
                                )}

                                {status === 'success' && (
                                    <>
                                        <div style={{
                                            fontSize: '4rem',
                                            marginBottom: '1rem',
                                            color: 'var(--ifm-color-success)'
                                        }}>
                                            ✓
                                        </div>
                                        <h2>Success!</h2>
                                        <p>{message}</p>
                                        <Link to="/" className="button button--primary margin-top--md">
                                            Go to Home
                                        </Link>
                                    </>
                                )}

                                {status === 'error' && (
                                    <>
                                        <div style={{
                                            fontSize: '4rem',
                                            marginBottom: '1rem',
                                            color: 'var(--ifm-color-danger)'
                                        }}>
                                            ✗
                                        </div>
                                        <h2>Verification Failed</h2>
                                        <p>{message}</p>
                                        <div className="button-group" style={{ marginTop: '1.5rem' }}>
                                            <a href={constructAuthUrlWithReturn('/signin')} className="button button--primary margin-right--sm">
                                                Sign In
                                            </a>
                                            <a href={constructAuthUrlWithReturn('/signup')} className="button button--secondary">
                                                Sign Up
                                            </a>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AuthCallbackPage;

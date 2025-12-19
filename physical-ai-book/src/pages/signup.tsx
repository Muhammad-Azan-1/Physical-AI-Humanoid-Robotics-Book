import React, { useState } from 'react';
import Layout from '@theme/Layout';
import SignupForm from '../components/auth/SignupForm';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useAuth } from '../contexts/AuthContext';
import '../components/auth/auth.css';

const SignupPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { siteConfig } = useDocusaurusContext();
  const [isSignedUp, setIsSignedUp] = useState(false);
  const signinUrl = `${siteConfig.baseUrl}signin`;
  const homeUrl = siteConfig.baseUrl;

  React.useEffect(() => {
    if (isAuthenticated) {
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl');
      const redirectUrl = returnUrl ? decodeURIComponent(returnUrl) : homeUrl;
      window.location.href = redirectUrl;
    }
  }, [isAuthenticated, homeUrl]);

  const getReturnUrl = (): string | null => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl');
      return returnUrl ? decodeURIComponent(returnUrl) : null;
    }
    return null;
  };

  const handleSignupSuccess = () => {
    setIsSignedUp(true);
  };

  const handleVerificationRedirect = () => {
    const returnUrl = getReturnUrl();
    if (returnUrl) {
      localStorage.setItem('original_destination', returnUrl);
    }
    window.location.href = signinUrl;
  };

  return (
    <Layout title="Sign Up" description="Create an account for the Physical AI & Humanoid Robotics book">
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Create an account</h1>
              <p>Join the Physical AI community</p>
            </div>

            {isSignedUp ? (
              <div className="auth-success">
                <div className="auth-success-icon">✓</div>
                <h2>Check Your Email!</h2>
                <p>
                  We've sent a verification link to your email address.
                  Click the link to activate your account.
                </p>
                <button
                  onClick={handleVerificationRedirect}
                  className="auth-submit-btn"
                >
                  Go to Sign In
                </button>
              </div>
            ) : (
              <SignupForm
                onSuccess={handleSignupSuccess}
                onSwitchToSignin={() => window.location.href = signinUrl}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;

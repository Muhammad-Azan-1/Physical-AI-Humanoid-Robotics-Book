import React, { useState } from 'react';
import Layout from '@theme/Layout';
import SignupForm from '../components/auth/SignupForm';
import Link from '@docusaurus/Link';
import { getValidRedirectUrl } from '../utils/authHelpers';

import useBaseUrl from '@docusaurus/useBaseUrl';
import { useAuth } from '../contexts/AuthContext';

const SignupPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isSignedUp, setIsSignedUp] = useState(false);
  const signinUrl = useBaseUrl('/signin');
  const homeUrl = useBaseUrl('/');

  // Redirect if already authenticated (or becomes authenticated via another tab)
  React.useEffect(() => {
    if (isAuthenticated) {
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl');
      const redirectUrl = returnUrl ? decodeURIComponent(returnUrl) : homeUrl;
      window.location.href = redirectUrl;
    }
  }, [isAuthenticated, homeUrl]);

  // Get return URL from query parameters
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

  // Handle redirect after email verification
  const handleVerificationRedirect = () => {
    const returnUrl = getReturnUrl();

    // Store the original destination if it exists, so the Sign In page can use it later
    if (returnUrl) {
      localStorage.setItem('original_destination', returnUrl);
    }

    // Always redirect to the Sign In page when clicking the button
    window.location.href = signinUrl;
  };

  return (
    <Layout title="Sign Up" description="Create an account for the Physical AI & Humanoid Robotics book">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <div className="card">
              <div className="card__header">
                <h1>Join the Physical AI & Humanoid Robotics Community</h1>
              </div>
              <div className="card__body">
                {isSignedUp ? (
                  <div className="signup-success">
                    <h2>Account Created Successfully!</h2>
                    <p>
                      We've sent a verification email to your inbox. Please check your email and click the verification link to activate your account.
                    </p>
                    <p>
                      <button
                        onClick={handleVerificationRedirect}
                        className="button button--primary"
                      >
                        Go to Sign In
                      </button>
                    </p>
                  </div>
                ) : (
                  <SignupForm
                    onSuccess={handleSignupSuccess}
                    onSwitchToSignin={() => window.location.href = '/signin'}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;

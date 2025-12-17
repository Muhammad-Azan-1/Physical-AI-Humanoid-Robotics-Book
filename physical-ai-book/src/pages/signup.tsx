import React, { useState } from 'react';
import Layout from '@theme/Layout';
import SignupForm from '../components/auth/SignupForm';
import Link from '@docusaurus/Link';
import { getValidRedirectUrl } from '../utils/authHelpers';

const SignupPage: React.FC = () => {
  const [isSignedUp, setIsSignedUp] = useState(false);

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
    const redirectUrl = getValidRedirectUrl(returnUrl, '/');
    window.location.href = redirectUrl;
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

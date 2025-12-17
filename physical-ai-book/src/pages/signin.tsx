import React from 'react';
import Layout from '@theme/Layout';
import LoginForm from '../components/auth/LoginForm';
import Link from '@docusaurus/Link';
import { getValidRedirectUrl } from '../utils/authHelpers';

const SigninPage: React.FC = () => {
  // Get return URL from query parameters
  const getReturnUrl = (): string | null => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl');
      return returnUrl ? decodeURIComponent(returnUrl) : null;
    }
    return null;
  };

  const handleLoginSuccess = () => {
    // Use return URL if available, otherwise default to home page
    const returnUrl = getReturnUrl();
    const redirectUrl = getValidRedirectUrl(returnUrl, '/');
    window.location.href = redirectUrl;
  };

  return (
    <Layout title="Sign In" description="Sign in to your account for the Physical AI & Humanoid Robotics book">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <div className="card">
              <div className="card__header">
                <h1>Welcome Back</h1>
                <p>Sign in to access premium content and track your learning progress</p>
              </div>
              <div className="card__body">
                <LoginForm
                  onSuccess={handleLoginSuccess}
                  onSwitchToSignup={() => window.location.href = '/signup'}
                  onForgotPassword={() => window.location.href = '/reset-password'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SigninPage;

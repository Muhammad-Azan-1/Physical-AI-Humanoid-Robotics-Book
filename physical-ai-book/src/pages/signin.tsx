import React from 'react';
import Layout from '@theme/Layout';
import LoginForm from '../components/auth/LoginForm';
import { getValidRedirectUrl } from '../utils/authHelpers';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import '../components/auth/auth.css';

const SigninPage: React.FC = () => {
  const { siteConfig } = useDocusaurusContext();
  const signupUrl = `${siteConfig.baseUrl}signup`;
  const resetPasswordUrl = `${siteConfig.baseUrl}reset-password`;

  const getReturnUrl = (): string | null => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl');
      return returnUrl ? decodeURIComponent(returnUrl) : null;
    }
    return null;
  };

  const handleLoginSuccess = () => {
    const returnUrl = getReturnUrl();
    const redirectUrl = getValidRedirectUrl(returnUrl, siteConfig.baseUrl);
    window.location.href = redirectUrl;
  };

  return (
    <Layout title="Sign In" description="Sign in to your account for the Physical AI & Humanoid Robotics book">
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Welcome back</h1>
              <p>Sign in to your account</p>
            </div>
            <LoginForm
              onSuccess={handleLoginSuccess}
              onSwitchToSignup={() => window.location.href = signupUrl}
              onForgotPassword={() => window.location.href = resetPasswordUrl}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SigninPage;

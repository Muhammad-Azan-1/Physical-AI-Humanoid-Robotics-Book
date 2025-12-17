import React from 'react';
import Layout from '@theme/Layout';
import PasswordResetForm from '../components/auth/PasswordResetForm';
import { constructAuthUrlWithReturn } from '../utils/returnUrlUtils';

const ResetPasswordPage: React.FC = () => {
  const handleResetSuccess = () => {
    // Redirect to sign in after successful password reset with return URL
    window.location.href = constructAuthUrlWithReturn('/signin');
  };

  return (
    <Layout title="Reset Password" description="Reset your account password">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <div className="card">
              <div className="card__header">
                <h1>Reset Your Password</h1>
                <p>Enter your email to receive a password reset link</p>
              </div>
              <div className="card__body">
                <PasswordResetForm
                  mode="request"
                  onSuccess={handleResetSuccess}
                  onSwitchToSignin={() => window.location.href = '/signin'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;
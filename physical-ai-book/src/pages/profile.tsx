import React from 'react';
import Layout from '@theme/Layout';
import UserProfile from '../components/auth/UserProfile';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const ProfilePage: React.FC = () => {
  return (
    <Layout title="User Profile" description="Manage your account profile and preferences">
      <div className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <div className="card">
              <div className="card__header">
                <h1>Your Profile</h1>
                <p>Manage your account information and preferences</p>
              </div>
              <div className="card__body">
                <ProtectedRoute requiredRole="authenticated">
                  <UserProfile />
                </ProtectedRoute>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
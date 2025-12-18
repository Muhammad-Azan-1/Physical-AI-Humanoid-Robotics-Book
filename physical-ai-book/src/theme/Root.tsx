import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import AuthStateSync from '../components/auth/AuthStateSync';

export default function Root({ children }) {
  return (
    <AuthProvider>
      <AuthStateSync />
      {children}
    </AuthProvider>
  );
}
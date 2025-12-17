import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// This hook wraps the context to provide type safety
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import AuthStateSync from '../components/auth/AuthStateSync';
import ChatbotComponent from '../components/Chatbot/ChatbotComponent';

export default function Root({ children }) {
  return (
    <AuthProvider>
      <AuthStateSync />
      {children}
      <ChatbotComponent />
    </AuthProvider>
  );
}
import React from 'react'
import { AuthProvider as AuthProviderComponent } from '../../contexts/AuthContext'

// This component is a wrapper for the AuthContext provider
// It's here to maintain consistency with the planned architecture
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AuthProviderComponent>{children}</AuthProviderComponent>
}

export default AuthProvider
export interface UserProfile {
  user_id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
  learning_progress: {
    completed_courses: string[];
    achievements: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  role: string;
  profile: UserProfile;
}

export interface AuthState {
  user: User | null;
  session: any | null; // Session type from Supabase
  loading: boolean;
  isAuthenticated: boolean;
}

export interface EmailVerificationState {
  isVerifying: boolean;
  verificationComplete: boolean;
  showSuccessMessage: boolean;
  redirectAfterVerification: boolean;
}

export interface SignUpOptions {
  username?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

export interface AuthContextType extends AuthState {
  emailVerificationState: EmailVerificationState;
  signUp: (email: string, password: string, options?: SignUpOptions) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<User | undefined>;
  verifyEmail: (token: string) => Promise<any>;
  resendVerificationEmail: (email: string) => Promise<{ success: boolean }>;
}
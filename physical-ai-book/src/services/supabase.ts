import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Supabase client for Docusaurus
// The client is initialized with credentials passed from React context
// using useDocusaurusContext hook

let supabaseInstance: SupabaseClient | null = null
let isInitialized = false

interface SupabaseCredentials {
  url: string
  anonKey: string
}

// Enhanced auth state change handler that supports cross-window synchronization
export const enhanceAuthStateHandling = (supabaseClient: SupabaseClient) => {
  // Listen for auth state changes and handle cross-window synchronization
  const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
    async (event, session) => {
      // Update localStorage to notify other windows of auth changes
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        const authState = {
          event,
          session: session ? {
            user: session.user ? {
              id: session.user.id,
              email: session.user.email,
              email_confirmed_at: session.user.email_confirmed_at,
              role: session.user.role,
              created_at: session.user.created_at,
              user_metadata: session.user.user_metadata
            } : null,
            expires_at: session.expires_at,
            expires_in: session.expires_in,
            token_type: session.token_type,
            access_token: session.access_token ? 'HIDDEN' : null, // Don't store actual token for security
            refresh_token: session.refresh_token ? 'HIDDEN' : null // Don't store actual token for security
          } : null,
          timestamp: Date.now()
        };

        // Store auth state in localStorage to sync across windows
        localStorage.setItem('auth-state', JSON.stringify(authState));
      }
    }
  );

  return subscription;
};

// Initialize Supabase with credentials from Docusaurus customFields
export const initializeSupabase = (credentials: SupabaseCredentials): SupabaseClient => {
  if (supabaseInstance && isInitialized) {
    return supabaseInstance
  }

  if (!credentials.url || !credentials.anonKey) {
    console.warn('Supabase credentials not provided. Using placeholder client.')
    supabaseInstance = createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
    return supabaseInstance
  }

  supabaseInstance = createClient(credentials.url, credentials.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
  isInitialized = true
  return supabaseInstance
}

// Get the current Supabase instance (may be uninitialized placeholder)
export const getSupabase = (): SupabaseClient => {
  if (supabaseInstance) {
    return supabaseInstance
  }

  // Return a placeholder client if not yet initialized
  // This will be replaced when initializeSupabase is called from AuthProvider
  supabaseInstance = createClient('https://placeholder.supabase.co', 'placeholder-key', {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })
  return supabaseInstance
}

// For backward compatibility
export const supabase = getSupabase()
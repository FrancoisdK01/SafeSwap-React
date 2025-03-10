import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client with a service role key (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  db: { schema: 'public' }
});

// Create Supabase client with retry logic and better error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'safeswap'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
});

// Add rate limiting for auth operations
const RATE_LIMIT_DELAY = 2000; // 2 seconds
let lastAuthAttempt = 0;

export const auth = {
  signIn: async (email, password) => {
    const now = Date.now();
    if (now - lastAuthAttempt < RATE_LIMIT_DELAY) {
      throw new Error('Please wait a moment before trying again.');
    }
    lastAuthAttempt = now;

    try {
      return await supabase.auth.signInWithPassword({
        email,
        password,
      });
    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error('Failed to sign in. Please try again later.');
    }
  },

  signUp: async (email, password) => {
    const now = Date.now();
    if (now - lastAuthAttempt < RATE_LIMIT_DELAY) {
      throw new Error('Please wait a moment before trying again.');
    }
    lastAuthAttempt = now;

    try {
      return await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      console.error('Sign up error:', error);
      throw new Error('Failed to sign up. Please try again later.');
    }
  },

  signOut: async () => {
    try {
      return await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out. Please try again later.');
    }
  },

  getSession: async () => {
    try {
      return await supabase.auth.getSession();
    } catch (error) {
      console.error('Get session error:', error);
      throw new Error('Failed to get session. Please try again later.');
    }
  },
};
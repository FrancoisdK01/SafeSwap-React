import { AuthError } from '@supabase/supabase-js';

export function getAuthErrorMessage(error: AuthError | null): string {
  if (!error) return '';

  switch (error.message) {
    case 'Email not confirmed':
      return 'Please check your email and click the confirmation link before signing in. The confirmation link may take a few minutes to arrive.';
    case 'Invalid login credentials':
      return 'Invalid email or password. Please try again.';
    case 'User already registered':
      return 'An account with this email already exists. Please sign in instead.';
    default:
      if (error.message.includes('rate limit')) {
        return 'Please wait a moment before trying again.';
      }
      return 'An unexpected error occurred. Please try again.';
  }
}
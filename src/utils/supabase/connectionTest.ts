import { supabase } from '../../config/supabase';

// Cache the connection test result
let connectionTestCache: {
  timestamp: number;
  result: {
    success: boolean;
    authenticated: boolean;
    message: string;
  };
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function testConnection() {
  // Return cached result if valid
  if (connectionTestCache && Date.now() - connectionTestCache.timestamp < CACHE_DURATION) {
    return connectionTestCache.result;
  }

  try {
    // Test authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;

    const result = {
      success: true,
      authenticated: !!user,
      message: user 
        ? `Connected and authenticated as ${user.email}` 
        : 'Connected but not authenticated'
    };

    // Cache the result
    connectionTestCache = {
      timestamp: Date.now(),
      result
    };

    return result;
  } catch (error: any) {
    const result = {
      success: false,
      authenticated: false,
      message: `Connection failed: ${error.message}`,
      error
    };

    // Cache the error result for a shorter duration
    connectionTestCache = {
      timestamp: Date.now() - (CACHE_DURATION / 2), // Cache errors for half the duration
      result
    };

    return result;
  }
}
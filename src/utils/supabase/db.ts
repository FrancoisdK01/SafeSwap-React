import { supabase } from '../../config/supabase';

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error('No authenticated user');
  return user;
}

export async function executeQuery<T>(query: Promise<{ data: T; error: any }>) {
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
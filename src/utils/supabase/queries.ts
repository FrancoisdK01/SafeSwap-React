import { supabase } from '../../config/supabase';

export async function getCurrentUserId() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No authenticated user');
  return user.id;
}

export async function executeQuery(query: any) {
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
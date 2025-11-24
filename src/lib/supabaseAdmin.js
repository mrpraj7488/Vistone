// Re-export from unified client manager to prevent multiple instances
import { supabaseAdmin as adminClient, getClient } from './supabaseClient';

export const supabaseAdmin = adminClient;
export const getSupabaseClient = getClient;

// Legacy compatibility - keep this function here to avoid breaking imports
export const isAdminContext = () => {
  return typeof window !== 'undefined' && window.location.pathname.includes('/admin');
};

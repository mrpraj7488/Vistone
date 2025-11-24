// Re-export from unified client manager to prevent multiple instances
import { supabase as supabaseClient, getClient } from './supabaseClient';

export { getClient };
export const supabase = supabaseClient;
export default supabaseClient;

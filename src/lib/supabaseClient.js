import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

// Debug environment variables
console.log('🔧 Supabase Config:', {
  url: supabaseUrl ? '✅ Set' : '❌ Missing',
  anonKey: supabaseAnonKey ? '✅ Set' : '❌ Missing',
  serviceKey: supabaseServiceKey ? '✅ Set' : '❌ Missing'
});

// Singleton instances
let publicClient = null;
let adminClient = null;

// Create public client (for regular users)
const createPublicClient = () => {
  if (publicClient) {
    console.log('🔄 Reusing existing public client');
    return publicClient;
  }

  console.log('🆕 Creating new public client');

  publicClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storageKey: 'vistone-auth',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      // Session will be refreshed automatically before expiry
      // The session refresh happens in background as long as user is active
    },
    global: {
      headers: {
        'x-client-info': 'vistone-public'
      }
    }
  });

  return publicClient;
};

// Create admin client (for admin operations)
const createAdminClient = () => {
  if (adminClient) {
    console.log('🔄 Reusing existing admin client');
    return adminClient;
  }

  if (!supabaseServiceKey) {
    console.warn('⚠️ Service key not available - admin operations will be limited');
    return null;
  }

  console.log('🆕 Creating new admin client');

  // Clear any existing admin auth storage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('vistone-admin-auth');
    localStorage.removeItem('vistone-admin-auth-token');
  }

  adminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      storageKey: 'vistone-admin-auth'
    },
    global: {
      headers: {
        'x-client-info': 'vistone-admin',
        'Authorization': `Bearer ${supabaseServiceKey}`
      }
    }
  });

  return adminClient;
};

// Helper to determine if we're in admin context
const isAdminContext = () => {
  return typeof window !== 'undefined' && window.location.pathname.includes('/admin');
};

// Export getter functions to ensure single instance
export const getSupabase = () => createPublicClient();
export const getSupabaseAdmin = () => createAdminClient();

// Lazy exports - only create clients when first accessed
let _supabase = null;
let _supabaseAdmin = null;

export const supabase = new Proxy({}, {
  get(target, prop) {
    if (!_supabase) {
      console.log('🚀 Creating supabase client on first access');
      _supabase = createPublicClient();
    }
    return _supabase[prop];
  }
});

export const supabaseAdmin = new Proxy({}, {
  get(target, prop) {
    if (!_supabaseAdmin) {
      console.log('🚀 Creating supabaseAdmin client on first access');
      _supabaseAdmin = createAdminClient();
    }
    return _supabaseAdmin && _supabaseAdmin[prop];
  }
});

// Smart client selector (automatically chooses the right client)
export const getClient = () => {
  if (isAdminContext() && supabaseAdmin) {
    return supabaseAdmin;
  }
  return supabase;
};

// Reset function for testing
export const resetClients = () => {
  publicClient = null;
  adminClient = null;
};

export default supabase;

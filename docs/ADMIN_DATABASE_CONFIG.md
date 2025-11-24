# 🔐 Admin Database Configuration Guide

## Service Role Key Setup for Admin Operations

Since you're using the **service role key** for admin operations, here's the proper setup:

### 1. Environment Variables Setup

Create separate Supabase clients for different access levels:

#### **For Admin Operations** (service role key):
```javascript
// src/lib/supabaseAdmin.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kzpoiyibmahcpnfsxqor.supabase.co'
const supabaseServiceKey = 'your-service-role-key-here' // Service role key

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
```

#### **For Regular User Operations** (anon key):
```javascript
// src/lib/supabase.js (existing)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kzpoiyibmahcpnfsxqor.supabase.co'
const supabaseAnonKey = 'your-anon-key-here' // Anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 2. Update Admin User Operations

Since you're using service role key, you can bypass RLS entirely for admin operations:

#### **Update Users.jsx to use Admin Client:**
```javascript
// In src/pages/admin/Users.jsx
import { supabaseAdmin } from '../../lib/supabaseAdmin'; // Use admin client
// Remove: import { supabase } from '../../lib/supabase';

// Update all database operations to use supabaseAdmin:
const { data, error } = await supabaseAdmin
  .from('user_profiles')
  .insert([insertData])
  .select()
  .single();
```

### 3. Database Setup with Service Role Access

Since you're using service role key, you can either:

#### **Option A: Disable RLS for Admin Tables**
```sql
-- Disable RLS for admin operations
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
```

#### **Option B: Keep RLS but Create Service Role Policies**
```sql
-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (bypasses RLS anyway, but good practice)
CREATE POLICY "Service role can do everything" ON user_profiles
    FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Create policy for authenticated users (regular users)
CREATE POLICY "Authenticated users can read own profile" ON user_profiles
    FOR SELECT 
    USING (auth.uid()::text = id::text);
```

### 4. Add Country Column (Updated SQL)

```sql
-- Add country column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS country TEXT;

-- Since you're using service role, no additional policies needed
-- The service role bypasses RLS automatically
```

### 5. Security Best Practices

#### **Environment Variables:**
```env
# .env.local (for admin panel)
VITE_SUPABASE_URL=https://kzpoiyibmahcpnfsxqor.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_KEY=your-service-role-key

# Only use service key in admin operations
# Never expose service key to client-side code for regular users
```

#### **Conditional Client Usage:**
```javascript
// src/lib/supabaseClient.js
import { supabase } from './supabase';
import { supabaseAdmin } from './supabaseAdmin';

// Use this function to get the right client
export const getSupabaseClient = (isAdmin = false) => {
  return isAdmin ? supabaseAdmin : supabase;
};
```

### 6. Updated Admin Operations

#### **User Creation with Service Role:**
```javascript
const handleCreateUser = async (userData) => {
  try {
    // Use service role client for admin operations
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .insert([{
        full_name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        phone: userData.phone?.trim() || null,
        role: userData.role || 'customer',
        status: userData.status || 'active',
        country: userData.country?.trim() || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Admin operation error:', error);
      toast.error(`Failed to create user: ${error.message}`);
      return;
    }

    // Success - user created with admin privileges
    toast.success('User created successfully!');
    return data;
  } catch (error) {
    console.error('Service role operation failed:', error);
    toast.error('Admin operation failed. Check service role key.');
  }
};
```

### 7. Troubleshooting Service Role Issues

#### **Common Problems:**

1. **Wrong Key Type:**
   - Make sure you're using the **service_role** key, not the **anon** key
   - Service role key is longer and starts with `eyJ...`

2. **Environment Variables:**
   - Check that `VITE_SUPABASE_SERVICE_KEY` is set correctly
   - Restart your dev server after changing env variables

3. **Client Configuration:**
   - Service role client should have `autoRefreshToken: false`
   - Service role client should have `persistSession: false`

#### **Test Service Role Access:**
```javascript
// Quick test function
const testServiceRoleAccess = async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('count(*)')
      .single();
    
    if (error) {
      console.error('Service role test failed:', error);
    } else {
      console.log('✅ Service role working:', data);
    }
  } catch (error) {
    console.error('❌ Service role connection failed:', error);
  }
};
```

### 8. Security Notes

⚠️ **Important Security Considerations:**

- **Never expose service role key** in client-side code for regular users
- **Only use service role** in admin panels and server-side operations
- **Regular users** should always use the anon key with proper RLS policies
- **Admin operations** can bypass RLS but should still validate data
- **Audit admin actions** for security compliance

### 9. Quick Fix for Current Issue

Since you're already using service role key, the quickest fix is:

1. **Add the country column:**
   ```sql
   ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS country TEXT;
   ```

2. **Disable RLS temporarily:**
   ```sql
   ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
   ```

3. **Test user creation** - it should work immediately

4. **Re-enable RLS later** with proper policies if needed

This setup will give you full admin control while maintaining security for regular users.

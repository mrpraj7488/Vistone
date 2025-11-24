# 🗄️ Database Setup Guide

This guide will help you set up the required database tables for the admin panel user management.

## 📋 Required Tables

### 1. user_profiles Table

This table stores user profile information for the admin panel.

#### SQL to Create Table:

```sql
-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'editor', 'admin')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  country TEXT,
  email_verified BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all profiles (for admin)
CREATE POLICY "Allow authenticated users to read user profiles" ON user_profiles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert new profiles (for admin)
CREATE POLICY "Allow authenticated users to insert user profiles" ON user_profiles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update profiles (for admin)
CREATE POLICY "Allow authenticated users to update user profiles" ON user_profiles
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete profiles (for admin)
CREATE POLICY "Allow authenticated users to delete user profiles" ON user_profiles
    FOR DELETE USING (auth.role() = 'authenticated');
```

### 2. Alternative: Using Supabase Auth Users

If you prefer to use Supabase's built-in auth.users table, you can modify the code to use that instead:

```javascript
// In Users.jsx, change the table name from 'user_profiles' to 'auth.users'
const { data, error } = await supabase
  .from('auth.users')  // Use built-in auth table
  .select('*');
```

## 🚀 Setup Instructions

### Option 1: Using Supabase Dashboard

1. **Open Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Navigate to your project: `kzpoiyibmahcpnfsxqor`

2. **Create Table**
   - Go to "Table Editor" in the sidebar
   - Click "Create a new table"
   - Name it `user_profiles`
   - Add the columns as specified above

3. **Set Up RLS**
   - Go to "Authentication" → "Policies"
   - Create the policies as shown above

### Option 2: Using SQL Editor

1. **Open SQL Editor**
   - In Supabase Dashboard, go to "SQL Editor"
   - Paste the SQL code above
   - Click "Run"

### Option 3: Using Migration Files

1. **Create Migration File**
   ```bash
   # In your project directory
   npx supabase migration new create_user_profiles_table
   ```

2. **Add SQL to Migration**
   - Paste the SQL code into the generated migration file
   - Run: `npx supabase db push`

## 🔧 Verification

After creating the table, you can verify it works by:

1. **Check Table Exists**
   ```sql
   SELECT * FROM user_profiles LIMIT 1;
   ```

2. **Test Insert**
   ```sql
   INSERT INTO user_profiles (full_name, email, role) 
   VALUES ('Test User', 'test@example.com', 'customer');
   ```

3. **Check in Admin Panel**
   - Try creating a user through the admin interface
   - Check the browser console for detailed logs

## 🐛 Troubleshooting

### Common Issues:

#### 1. Table Not Found (42P01)
```
Error: relation "user_profiles" does not exist
```
**Solution:** Create the table using the SQL above.

#### 2. Permission Denied (42501)
```
Error: permission denied for table user_profiles
```
**Solution:** Set up RLS policies as shown above.

#### 3. Duplicate Email (23505)
```
Error: duplicate key value violates unique constraint
```
**Solution:** This is expected - emails must be unique. Try a different email.

#### 4. Missing Required Field (23502)
```
Error: null value in column "email" violates not-null constraint
```
**Solution:** Ensure email field is filled in the form.

### Debug Steps:

1. **Check Console Logs**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Try creating a user
   - Look for detailed error messages

2. **Check Network Tab**
   - In DevTools, go to Network tab
   - Try creating a user
   - Look for failed requests to Supabase

3. **Check Supabase Logs**
   - In Supabase Dashboard, go to "Logs"
   - Look for recent errors

## 📊 Table Schema Reference

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Auto-generated unique ID |
| full_name | TEXT | - | User's full name |
| email | TEXT | UNIQUE, NOT NULL | User's email address |
| phone | TEXT | - | User's phone number |
| role | TEXT | CHECK constraint | customer, editor, or admin |
| status | TEXT | CHECK constraint | active, suspended, or pending |
| country | TEXT | - | User's country |
| email_verified | BOOLEAN | DEFAULT false | Email verification status |
| two_factor_enabled | BOOLEAN | DEFAULT false | 2FA status |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

## 🔐 Security Notes

- **RLS Enabled**: Row Level Security is enabled for data protection
- **Authenticated Access**: Only authenticated users can access the table
- **Admin Only**: In production, you may want to restrict to admin users only
- **Email Validation**: Emails are unique and required
- **Role Constraints**: Only specific roles are allowed

## 🎯 Next Steps

After setting up the database:

1. **Test User Creation** - Try creating a user through the admin panel
2. **Check Logs** - Monitor console logs for any issues
3. **Verify Data** - Check that users appear in both the UI and database
4. **Set Up Backups** - Configure regular database backups
5. **Monitor Performance** - Watch for slow queries as data grows

If you continue to have issues, check the browser console logs when trying to create a user - the detailed logging will show exactly what's happening!

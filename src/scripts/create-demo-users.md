# Create Demo Users Script

## ⚠️ IMPORTANT: Run Database Setup First!

Before creating users, you **MUST** run the SQL setup script:

1. Go to: https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/sql
2. Click "New Query"
3. Copy the entire contents of `/supabase/setup.sql`
4. Paste and click "Run"
5. Verify 5 tables were created

## Creating Demo Users

### Option 1: Use the Signup Page (Recommended)

1. Start your dev server: `npm run dev`
2. Navigate to: `http://localhost:5173/signup`
3. Create an account:

**Demo End User:**
```
Full Name: Demo User
Email: demo@gace.app
User Type: Individual / End User
Password: demo123456
Confirm Password: demo123456
```

**Demo Accountant:**
```
Full Name: Demo Accountant
Email: accountant@gace.app
User Type: Accountant / Tax Professional
Company Name: GACE Accounting Ltd
Password: demo123456
Confirm Password: demo123456
```

**Demo Admin:**
```
Full Name: Demo Admin
Email: admin@gace.app
User Type: Administrator
Password: demo123456
Confirm Password: demo123456
```

### Option 2: Use Supabase SQL (If signup fails)

If the signup page gives errors, you can create users directly in Supabase:

1. Go to: https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/auth/users
2. Click "Add user" → "Create new user"
3. Enter:
   - Email: demo@gace.app
   - Password: demo123456
   - Check "Auto Confirm User"
4. Click "Create user"
5. Copy the User ID (UUID)
6. Go to SQL Editor and run:

```sql
-- Insert user profile for the demo user
INSERT INTO user_profiles (id, email, user_type, full_name, has_completed_onboarding)
VALUES (
  'PASTE_USER_ID_HERE',  -- Replace with the UUID from step 5
  'demo@gace.app',
  'end-user',
  'Demo User',
  false
);
```

## Verifying Users Were Created

### Check Auth Users:
1. Go to: https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/auth/users
2. You should see your demo users listed

### Check User Profiles:
1. Go to: https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/editor
2. Click "user_profiles" table
3. You should see matching profiles

## Testing Login

1. Go to: `http://localhost:5173/login`
2. Enter:
   - Email: demo@gace.app
   - Password: demo123456
3. Click "Sign In"
4. You should be redirected to onboarding (first time) or dashboard

## Troubleshooting

### Error: "Invalid login credentials"

**Cause:** User doesn't exist or password is wrong

**Solutions:**
1. Double-check you ran `/supabase/setup.sql`
2. Verify user exists in Auth Users
3. Verify profile exists in user_profiles table
4. Try creating user again via signup page
5. Check password is exactly `demo123456`

### Error: "User profile not found"

**Cause:** Auth user exists but no profile in database

**Solution:**
Run this SQL (replace USER_ID):
```sql
INSERT INTO user_profiles (id, email, user_type, full_name, has_completed_onboarding)
VALUES (
  'YOUR_USER_ID_HERE',
  'demo@gace.app',
  'end-user',
  'Demo User',
  false
);
```

### Error: "Email rate limit exceeded"

**Cause:** Supabase has email rate limits in development

**Solution:**
1. Go to: https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/settings/auth
2. Scroll to "Email Auth"
3. Disable "Enable email confirmations"
4. OR create user via SQL method above

### Signup page doesn't work

**Check these:**
1. Browser console for errors
2. Network tab for failed requests
3. Supabase project is not paused
4. Database tables exist
5. RLS policies are correct

## Quick Test Checklist

- [ ] Can create account via signup page
- [ ] User appears in Supabase Auth
- [ ] Profile created in user_profiles table
- [ ] Can login with credentials
- [ ] Redirected to onboarding
- [ ] Can complete onboarding
- [ ] Redirected to dashboard
- [ ] Can logout
- [ ] Can login again (skips onboarding)

## Demo User Credentials (After Creation)

```
End User:
Email: demo@gace.app
Password: demo123456

Accountant:
Email: accountant@gace.app
Password: demo123456

Admin:
Email: admin@gace.app
Password: demo123456
```

## Need More Help?

If you're still getting errors:

1. Check browser console (F12)
2. Check Supabase logs: https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/logs/auth-logs
3. Verify SQL setup ran successfully
4. Try creating a user with a different email
5. Make sure project isn't paused

---

**Once you have a working demo user, you can login and start testing the app!** 🚀

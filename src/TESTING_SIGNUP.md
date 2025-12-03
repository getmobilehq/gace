# Testing the Fixed Signup Flow

## Quick Test Steps

### 1. Sign Up New User

1. Navigate to the signup page
2. Fill in the form:
   - **Email**: test@example.com
   - **Password**: testpassword123
   - **Full Name**: Test User
   - **User Type**: Select "End User" or "Accountant"
   - **Company Name** (optional): Test Company

3. Click "Sign Up"

### Expected Behavior

✅ **Success Flow:**
1. User account created in Supabase Auth
2. Server creates user profile (bypassing RLS)
3. Console logs: `✅ Profile created successfully`
4. Automatically redirected to onboarding page
5. After onboarding, redirected to dashboard

❌ **If you see errors**, check:
- Is the server running? (Edge functions deployed)
- Is the database setup complete? (SQL script ran)
- Check browser console for detailed error messages

### 2. Sign In Existing User

If you already have an account or used the demo credentials:

```
Email: demo@gace.app
Password: demo123456
```

1. Navigate to login page
2. Enter credentials
3. Click "Sign In"

✅ **Expected**: Redirect to dashboard (or onboarding if incomplete)

### 3. Test Demo Account

The login page shows demo credentials. Use them to test the full application flow.

## Common Issues & Solutions

### Issue 1: "Table not found" error
**Solution**: Run the SQL setup script in Supabase SQL Editor
- File: `/supabase/setup.sql`
- Dashboard: https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/sql

### Issue 2: "Service unavailable" error
**Solution**: Check that Edge Functions are deployed
- The server at `/supabase/functions/server/index.tsx` must be running

### Issue 3: Profile not created
**Solution**: Check server logs for the `/auth/create-profile` endpoint
- Look for error messages in the Edge Function logs

### Issue 4: RLS policy error (should be fixed now!)
**Solution**: This was the bug we just fixed! If you still see it:
- Make sure you're using the updated auth service
- Clear browser cache and reload
- Check that the server endpoint is being called

## Checking Console Logs

Open browser DevTools (F12) and look for these messages:

### ✅ Success Messages:
```
Auth signup successful
✅ Profile created successfully: {id, email, ...}
Auth state changed: logged in
```

### ❌ Error Messages to Watch For:
```
Profile creation error via API: {...}
Auth signup error: {...}
Error loading user profile: {...}
```

## Database Verification

To verify profiles are being created, run this in Supabase SQL Editor:

```sql
-- Check user profiles exist
SELECT id, email, user_type, full_name, has_completed_onboarding
FROM user_profiles
ORDER BY created_at DESC
LIMIT 10;

-- Check RLS policies are active
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'user_profiles';
```

## API Endpoint Testing

You can test the server endpoint directly with curl:

```bash
curl -X POST https://faczbtutzsrcnlrahifb.supabase.co/functions/v1/make-server-b5fd51b8/auth/create-profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "userId": "test-user-id",
    "email": "test@example.com",
    "fullName": "Test User",
    "userType": "end-user"
  }'
```

## Ready to Test! 🚀

The RLS error is fixed. You can now:
1. Create new accounts without errors
2. Test the full signup → onboarding → dashboard flow
3. Build out the remaining features (AI recommendations, demo data)

**Note**: Demo credentials may or may not exist yet. If they don't work, just create a new account!

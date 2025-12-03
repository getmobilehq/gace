# 🔧 Authentication Error Fix Guide

## ❌ Error: "Invalid login credentials"

This error means the user doesn't exist in Supabase or the password is incorrect.

---

## ✅ Step-by-Step Fix

### **Step 1: Verify Database Setup** (5 minutes)

The most common cause is the database tables don't exist yet.

1. **Open Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb

2. **Check if tables exist:**
   - Left sidebar → "Table Editor"
   - Look for these 5 tables:
     - ✅ user_profiles
     - ✅ assets
     - ✅ documents
     - ✅ tax_calculations
     - ✅ compliance_alerts

3. **If tables are missing, run the SQL setup:**
   - Left sidebar → "SQL Editor"
   - Click "New query"
   - Open `/supabase/setup.sql` in your code editor
   - Copy **ALL** the content (Ctrl+A, Ctrl+C)
   - Paste into Supabase SQL Editor
   - Click "Run" (or press Ctrl+Enter)
   - Wait for "Success. No rows returned"

4. **Verify tables were created:**
   - Go back to Table Editor
   - You should now see all 5 tables ✅

---

### **Step 2: Create Your First User** (3 minutes)

Now that the database is set up, create a test user:

#### **Option A: Use Signup Page (Easiest)**

1. Make sure your dev server is running:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:5173/signup`

3. Fill in the form:
   ```
   Full Name: Test User
   Email: test@gace.app
   User Type: Individual / End User
   Password: test123456
   Confirm Password: test123456
   ```

4. Click "Create Account"

5. If successful, you'll be redirected to onboarding ✅

6. Complete the onboarding steps

7. You'll land on the dashboard ✅

#### **Option B: Create User via Supabase Dashboard**

If signup fails, create the user manually:

1. **Go to Auth section:**
   - https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/auth/users

2. **Click "Add user" button**

3. **Select "Create new user"**

4. **Fill in:**
   - Email: `test@gace.app`
   - Password: `test123456`
   - ✅ Check "Auto Confirm User"

5. **Click "Create user"**

6. **IMPORTANT: Copy the User ID (UUID)** that appears

7. **Now create the profile in database:**
   - Go to SQL Editor: https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/sql
   - Run this SQL (replace `YOUR_USER_ID`):

   ```sql
   INSERT INTO user_profiles (id, email, user_type, full_name, has_completed_onboarding)
   VALUES (
     'YOUR_USER_ID_HERE',  -- Paste the UUID you copied
     'test@gace.app',
     'end-user',
     'Test User',
     false
   );
   ```

8. **Click "Run"**

9. **Verify it worked:**
   - Table Editor → user_profiles
   - You should see your new user

---

### **Step 3: Test Login** (2 minutes)

1. **Go to login page:**
   - http://localhost:5173/login

2. **Enter credentials:**
   ```
   Email: test@gace.app
   Password: test123456
   ```

3. **Click "Sign In"**

4. **Expected result:**
   - ✅ First time: Redirected to `/onboarding/end-user`
   - ✅ After onboarding: Redirected to `/dashboard/overview`

5. **If you get an error, see Troubleshooting below**

---

## 🔍 Troubleshooting Specific Errors

### Error: "Invalid login credentials"

**Cause:** User doesn't exist or password is wrong

**Check:**
1. User exists in Auth:
   - https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/auth/users
   - Look for `test@gace.app`

2. Profile exists in database:
   - Table Editor → user_profiles
   - Look for matching email

3. Password is exactly `test123456` (case-sensitive)

**Fix:**
- If user missing → Create via Option B above
- If profile missing → Run the SQL INSERT above
- If password wrong → Reset in Auth Users section

---

### Error: "User profile not found"

**Cause:** User exists in Auth but not in user_profiles table

**Fix:**
```sql
-- Get the user ID from Auth Users page, then run:
INSERT INTO user_profiles (id, email, user_type, full_name, has_completed_onboarding)
VALUES (
  'PASTE_USER_ID_HERE',
  'test@gace.app',
  'end-user',
  'Test User',
  false
);
```

---

### Error: "Failed to fetch"

**Cause:** Supabase project might be paused or network issue

**Check:**
1. Project status:
   - https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb
   - Look for "Project paused" banner

2. Network:
   - Open browser DevTools (F12)
   - Network tab
   - Try login again
   - Look for failed requests

**Fix:**
- If paused → Restore project
- If network error → Check internet connection

---

### Signup doesn't work

**Possible causes:**
1. Email rate limit
2. Email confirmations enabled
3. Database tables missing
4. RLS policies blocking

**Fixes:**

**For email rate limit:**
- Wait 1 hour
- OR disable email confirmations:
  1. Settings → Authentication
  2. Uncheck "Enable email confirmations"
  3. Save

**For database issues:**
- Re-run `/supabase/setup.sql`
- Check RLS policies in Table Editor

---

## 🎯 Quick Verification Checklist

Run through this checklist:

- [ ] Supabase project is active (not paused)
- [ ] SQL setup script has been run
- [ ] 5 tables exist in Table Editor
- [ ] User exists in Auth Users
- [ ] User profile exists in user_profiles table
- [ ] Password is correct
- [ ] Browser console shows no errors
- [ ] Network requests are succeeding

If all checkboxes are ticked and login still fails, check the detailed logs:

1. **Browser Console:**
   - Press F12
   - Console tab
   - Look for red errors

2. **Supabase Auth Logs:**
   - https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/logs/auth-logs
   - Look for failed login attempts

---

## 🚀 After Login Works

Once you can successfully login:

1. ✅ Complete onboarding
2. ✅ Explore the dashboard
3. ✅ Try Asset Manager (`/dashboard/assets`)
4. ✅ Test logout and login again

---

## 📝 Summary of Files I Created

To fix the auth issue, I created:

1. `/utils/supabase/auth.ts` - Auth service implementation
2. `/scripts/create-demo-users.md` - User creation guide
3. `/AUTH_FIX_GUIDE.md` - This troubleshooting guide

The auth service was missing, which could cause issues. It's now implemented and ready to use.

---

## 💡 Pro Tips

**For presentations:**
Create demo users ahead of time:
```
demo@gace.app / demo123456
accountant@gace.app / demo123456
admin@gace.app / demo123456
```

**For development:**
Use a consistent test account:
```
test@gace.app / test123456
```

**For production:**
- Enable email confirmations
- Use strong passwords
- Set up proper email templates
- Configure OAuth providers

---

## ✅ Everything Should Work Now!

1. Database setup is documented
2. Auth service is implemented
3. User creation is explained
4. Troubleshooting is covered

**Try these steps in order and your login should work!** 🎉

If you still get errors after following this guide, let me know the specific error message and I'll help debug further.

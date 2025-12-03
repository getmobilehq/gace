# GACE - Signup Debugging Guide

**How to debug individual account creation issues**

---

## 🔍 Check Browser Console

When signup fails, **ALWAYS** check the browser console (F12 → Console tab).

You should see detailed logs like this:

### ✅ Successful Signup Flow:

```
=== SIGNUP STARTED ===
Email: john@example.com
User Type: end-user
Full Name: John Doe
Company Name: N/A

Auth signup started for: john@example.com
Starting signup for: john@example.com as end-user
Auth user created successfully: abc123-user-id
Creating profile via server endpoint...
Profile created successfully: { id: "abc123", full_name: "John Doe", ... }

=== SIGNUP SUCCESSFUL ===

Auth state changed: logged in
Loading user profile for ID: abc123-user-id
✅ Profile loaded successfully: { id: "abc123", ... }
```

### ❌ Failed Signup - Common Errors:

---

## 🚨 Error Pattern #1: Server Endpoint Not Found

**Console shows:**
```
POST https://YOUR_PROJECT.supabase.co/functions/v1/make-server-b5fd51b8/auth/create-profile 404
Failed to create user profile
```

**Cause**: Edge function not deployed

**Fix**:
```bash
# Deploy the server function
supabase functions deploy server

# Verify deployment
supabase functions list

# Should show:
# - server (deployed)
```

**Test the endpoint**:
```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-b5fd51b8/health
# Should return: {"status":"ok","timestamp":"..."}
```

---

## 🚨 Error Pattern #2: Database Table Not Found

**Console shows:**
```
Error creating user profile: { code: "42P01", message: "relation \"user_profiles\" does not exist" }
```

**Cause**: Database tables not created

**Fix**:
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `/supabase/setup.sql`
3. Paste and run
4. Verify success (should say "Success. No rows returned")

**Verify tables exist**:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'user_profiles';
```

Should return 1 row.

---

## 🚨 Error Pattern #3: RLS Policy Violation

**Console shows:**
```
Error creating user profile: { code: "42501", message: "new row violates row-level security policy" }
```

**Cause**: This should NOT happen anymore (we use server endpoint with service role key)

**If you still see this**:
1. The server endpoint is not being called
2. Check if `projectId` is correct in `/utils/supabase/info.tsx`
3. Check browser Network tab to see which URL is being called

**Fix**:
```typescript
// In /utils/supabase/info.tsx
export const projectId = "YOUR_ACTUAL_PROJECT_ID"; // Update this!
export const publicAnonKey = "YOUR_ANON_KEY";
```

---

## 🚨 Error Pattern #4: Rate Limiting

**Console shows:**
```
Auth signup error: { message: "For security purposes, you can only request this after 4 seconds" }
```

**Cause**: Too many signup attempts too quickly

**Fix**: Wait 5-10 seconds and try again

**Prevention**: The app now has built-in rate limiting that prevents this

---

## 🚨 Error Pattern #5: Email Already Registered

**Console shows:**
```
Error: This email is already registered. Please sign in instead or use a different email.
```

**Cause**: Email is already in use

**Fix**:
- Option 1: Use a different email
- Option 2: Sign in instead of signing up
- Option 3: Delete the existing user from Supabase Dashboard → Authentication → Users

---

## 🚨 Error Pattern #6: Profile Not Loading After Signup

**Console shows:**
```
=== SIGNUP SUCCESSFUL ===
Auth state changed: logged in
Loading user profile for ID: abc123
Profile not found, attempting to create from auth metadata...
Auth metadata: { full_name: "John Doe", user_type: "end-user" }
✅ Profile created successfully from metadata
```

**This is OK!** The app has a fallback mechanism that creates the profile from metadata if the main creation failed.

**But if you see**:
```
Profile not found, attempting to create from auth metadata...
No metadata available to create profile
```

**Then the auth signup didn't save metadata correctly.**

**Fix**: Check that the signup is passing metadata:
```typescript
// In auth.tsx signUp method
await this.supabase.auth.signUp({
  email,
  password,
  options: {
    data: {  // <-- This must exist
      full_name: userData.fullName,
      user_type: userData.userType,
      company_name: userData.companyName,
    },
  },
});
```

---

## 🔧 Step-by-Step Debugging Process

### 1. Open Browser Console (F12)
- Clear the console
- Click "Preserve log" to keep messages after navigation

### 2. Attempt Signup
- Fill in the form:
  - Full Name: Test User
  - Email: test@example.com
  - User Type: Individual / End User
  - Password: password123
  - Confirm Password: password123
- Click "Create Account"

### 3. Watch the Console
- Look for `=== SIGNUP STARTED ===`
- Check if email and user type are correct
- Look for any red error messages

### 4. Check Network Tab
- Go to Network tab in DevTools
- Filter by "Fetch/XHR"
- Look for these requests:
  1. `POST /auth/v1/signup` (Supabase Auth)
  2. `POST /functions/v1/make-server-b5fd51b8/auth/create-profile` (Profile creation)

### 5. Inspect Requests
Click on each request and check:

**For `/auth/v1/signup`:**
- Status: Should be 200 OK
- Response: Should have `user.id` and `session`

**For `/auth/create-profile`:**
- Status: Should be 200 or 201
- Request body: Should have userId, email, fullName, userType
- Response: Should have `profile` object

---

## 🧪 Test Cases

### Test 1: Basic Individual Signup
```
Full Name: Test User
Email: test1@example.com
Type: Individual / End User
Password: password123
```

**Expected**: Account created, redirected to onboarding

### Test 2: Accountant Signup
```
Full Name: Jane Smith
Email: jane@accountingfirm.com
Type: Accountant / Tax Professional
Company: Smith & Co Accounting
Password: password123
```

**Expected**: Account created, redirected to accountant onboarding

### Test 3: Admin Signup
```
Full Name: Admin User
Email: admin@gace.com
Type: Administrator
Password: password123
```

**Expected**: Account created, redirected to admin dashboard (no onboarding)

### Test 4: Duplicate Email
```
Email: test1@example.com (already used above)
```

**Expected**: Error message "Email already registered"

### Test 5: Rapid Clicking
```
Click "Create Account" button 5 times rapidly
```

**Expected**: Error message "Please wait X seconds..."

---

## 📋 Pre-Signup Checklist

Before attempting signup, verify:

- [ ] Supabase project is created
- [ ] Edge function deployed (`supabase functions deploy server`)
- [ ] Database tables created (run `/supabase/setup.sql`)
- [ ] Project ID and Anon Key are correct in `/utils/supabase/info.tsx`
- [ ] Browser console is open
- [ ] Internet connection is working

---

## 🔬 Advanced Debugging

### Check Edge Function Logs

```bash
# Watch function logs in real-time
supabase functions logs server --follow

# Or view recent logs
supabase functions logs server
```

**Look for**:
- "Creating user profile for:" messages
- Any error stack traces
- HTTP response codes

### Check Database Directly

```sql
-- Check if user was created in auth
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Check if profile was created
SELECT id, email, full_name, user_type, created_at 
FROM public.user_profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- Check for orphaned auth users (auth user but no profile)
SELECT u.id, u.email, u.created_at
FROM auth.users u
LEFT JOIN public.user_profiles p ON u.id = p.id
WHERE p.id IS NULL
ORDER BY u.created_at DESC;
```

### Check RLS Policies

```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'user_profiles';
-- rowsecurity should be TRUE

-- Check policies exist
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_profiles';
-- Should show: user_profiles_select, user_profiles_update
```

---

## 💡 Common Mistakes

### ❌ Wrong Project ID
```typescript
// WRONG:
export const projectId = "abcdefgh"; // Too short

// RIGHT:
export const projectId = "abcdefghijklmnop"; // 16 characters
```

### ❌ Using Wrong Key
```typescript
// WRONG - Never use service role key in frontend!
export const publicAnonKey = "eyJhbGc...SERVICE_ROLE...";

// RIGHT - Use anon/public key
export const publicAnonKey = "eyJhbGc...ANON...";
```

### ❌ CORS Issues
If you see CORS errors, the server is not configured correctly.

**Check `/supabase/functions/server/index.tsx`:**
```typescript
app.use("/*", cors({
  origin: "*",  // For development
  // For production, use specific origin
}));
```

---

## ✅ Success Indicators

You know signup worked when you see:

1. ✅ Console shows `=== SIGNUP SUCCESSFUL ===`
2. ✅ Console shows `✅ Profile loaded successfully`
3. ✅ Page redirects to onboarding
4. ✅ Network tab shows both requests returned 200/201
5. ✅ User appears in Supabase Dashboard → Authentication
6. ✅ Profile appears in Supabase Dashboard → Database → user_profiles

---

## 🆘 Still Not Working?

1. **Clear browser cache and cookies**
2. **Try in incognito/private window**
3. **Try different browser**
4. **Check Supabase project isn't paused** (free tier auto-pauses)
5. **Verify Supabase is up**: https://status.supabase.com
6. **Check function is deployed**: `supabase functions list`
7. **Re-deploy function**: `supabase functions deploy server --no-verify-jwt`

---

**Last Updated**: 2024-11-30  
**For**: GACE v1.0.1

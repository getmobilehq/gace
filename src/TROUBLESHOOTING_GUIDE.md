# GACE Troubleshooting Guide 🔧

## Table of Contents
1. [Duplicate Email Error](#duplicate-email-error)
2. [Login Issues](#login-issues)
3. [404 Errors](#404-errors)
4. [Database Issues](#database-issues)
5. [Onboarding Problems](#onboarding-problems)
6. [General Debugging](#general-debugging)

---

## Duplicate Email Error

### Error Message:
```
This email is already registered. Please sign in instead or use a different email.
```

### ✅ Solution:
When you see this error, you'll now see helpful action buttons:

**Option 1: Sign In (Recommended)**
- Click **"Go to Login Page"** button
- Enter your email and password
- System will redirect you appropriately

**Option 2: Use Different Email**
- Click **"Try a different email"** button
- Form clears automatically
- Enter a new email address
- Complete signup

**Option 3: Delete Test Account (Testing Only)**
- Use **CleanupTool** in top-right corner
- Enter the email to delete
- Click "Delete User"
- Try signup again

### Prevention:
- Use email aliases for testing: `email+test1@gmail.com`
- Keep track of test accounts
- Use CleanupTool between tests

---

## Login Issues

### Issue: "Invalid email or password"

**Causes:**
1. Wrong password
2. Email not registered
3. Typo in email/password

**Solutions:**
1. Double-check email spelling
2. Verify password (case-sensitive)
3. Try signing up if you don't have an account
4. Check Route Debugger (bottom-left) to verify auth state

### Issue: "Can't login even with correct credentials"

**Causes:**
1. Profile not created properly
2. Database connection issue
3. Auth service issue

**Solutions:**
1. Check browser console (F12) for errors
2. Look for "Profile not found" errors
3. Verify Supabase is connected
4. Check database tables exist
5. Try logging out and back in
6. Clear browser cache and try again

### Issue: "Stuck on loading screen after login"

**Causes:**
1. Profile data not loading
2. Onboarding status check failing
3. Network timeout

**Solutions:**
1. Wait 5-10 seconds (could be slow connection)
2. Check browser console for errors
3. Check Network tab for failed requests
4. Hard refresh (Ctrl+Shift+R)
5. Clear browser cache

---

## 404 Errors

### Issue: Getting 404 on valid pages

**✅ This should now be FIXED!**

**If you still see 404:**

1. **Hard Refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear Cache**: 
   - Chrome: Ctrl+Shift+Del → Clear cache
   - Firefox: Ctrl+Shift+Del → Clear cache
3. **Check URL**: Make sure it matches valid routes
4. **Check Route Debugger**: Bottom-left shows current path
5. **Check Console**: Look for routing errors

### Valid Routes:
```
Public:
  /                           → Login (redirects)
  /login                      → Login page
  /signup                     → Signup page

Onboarding:
  /onboarding/end-user        → End user flow
  /onboarding/accountant      → Accountant flow

Dashboard:
  /dashboard/overview         → Compliance overview
  /dashboard/assets           → Asset manager
  /dashboard/documents        → Document ingestion
  /dashboard/scanner          → Global scanner
  /dashboard/tax-engine       → Tax engine
  /dashboard/alerts           → Alerts
  /dashboard/reports          → Reports
  /dashboard/help             → Help docs

Admin:
  /admin                      → Admin dashboard
```

### Issue: 404 after clicking "Forgot password"

**✅ This is now FIXED!**
- Button now shows helpful message instead of navigating

### Issue: 404 after signup

**✅ This is now FIXED!**
- AuthContext now handles navigation automatically
- Should redirect to `/onboarding/{user_type}`

---

## Database Issues

### Issue: "Database setup required"

**Causes:**
- Tables don't exist in Supabase
- First time setup not completed

**Solutions:**
1. Look for **DatabaseSetupGuide** that appears
2. Follow the SQL commands provided
3. Run in Supabase SQL Editor
4. Refresh page and try again

### Issue: "Profile not found"

**Causes:**
1. User created but profile insert failed
2. Database tables missing
3. Profile row not created properly

**Solutions:**
1. Check browser console for specific error
2. Verify `profiles` table exists in Supabase
3. Check if user exists in Auth but not in profiles table
4. Try ProfileMissingFix component (loads automatically)
5. Delete user and recreate with CleanupTool

### Issue: Data not saving

**Causes:**
1. API call failing
2. Permission issues
3. Network error

**Solutions:**
1. Check Network tab for failed requests
2. Check console for error messages
3. Verify Supabase connection
4. Check RLS policies on tables
5. Verify user is authenticated

---

## Onboarding Problems

### Issue: Can't complete onboarding

**Causes:**
1. Required fields missing
2. API call failing
3. Database update failing

**Solutions:**
1. Fill all required fields
2. Check console for errors
3. Click "Complete Onboarding" button
4. Wait for success message
5. Should redirect to dashboard automatically

### Issue: Stuck on onboarding after completing

**Causes:**
1. `has_completed_onboarding` not set to true
2. Navigation not working
3. Profile not updated

**Solutions:**
1. Check Route Debugger → Shows onboarding status
2. Check browser console
3. Verify database profile has `has_completed_onboarding = true`
4. Try hard refresh
5. Log out and log back in

### Issue: Redirected to onboarding every time

**Causes:**
1. Onboarding status not saving
2. Profile update failing

**Solutions:**
1. Complete onboarding fully
2. Check console for update errors
3. Verify database profile updated
4. Check if `onComplete` callback working
5. Manually update database as workaround

---

## General Debugging

### Debug Tools Available:

#### 1. Route Debugger (Bottom-Left Corner)
```
Shows:
- Current path
- Auth status (✓ or ✗)
- User email
- User type
- Onboarding status
- Loading state
```

#### 2. Browser Console (Press F12)
```
Shows:
- Error messages
- API responses
- Navigation logs
- Auth state changes
- Database queries
```

#### 3. Network Tab (F12 → Network)
```
Shows:
- API calls
- Response codes
- Request/response data
- Failed requests
- Timing information
```

#### 4. CleanupTool (Signup Page, Top-Right)
```
Use to:
- Delete test users
- Clear stuck accounts
- Reset for testing
- Start fresh
```

#### 5. TestHelper (Signup Page)
```
Shows:
- Backend status
- Supabase connection
- Database availability
```

---

## Common Debugging Steps

### When something isn't working:

1. **Check Route Debugger**
   - Are you authenticated?
   - Is the path correct?
   - Has onboarding completed?

2. **Check Browser Console**
   - Any red error messages?
   - What was the last log message?
   - Any failed API calls?

3. **Check Network Tab**
   - Are requests completing?
   - What's the response code?
   - What's the error message?

4. **Try Hard Refresh**
   - Ctrl+Shift+R (Windows)
   - Cmd+Shift+R (Mac)
   - Clears React Router cache

5. **Try Incognito/Private Window**
   - Tests fresh session
   - No cache/cookies
   - Isolates browser issues

6. **Check Supabase Dashboard**
   - Auth → Users (verify user exists)
   - Database → Tables → profiles (verify profile)
   - Logs (check for errors)

---

## Error Code Reference

### AUTH_ERROR
- **Cause**: Authentication failed
- **Fix**: Verify credentials, check Supabase connection

### DATABASE_NOT_SETUP
- **Cause**: Tables don't exist
- **Fix**: Run DatabaseSetupGuide SQL

### PROFILE_NOT_FOUND
- **Cause**: User exists but profile missing
- **Fix**: ProfileMissingFix component or CleanupTool

### DUPLICATE_EMAIL
- **Cause**: Email already registered
- **Fix**: Login or use different email

### RATE_LIMIT
- **Cause**: Too many requests
- **Fix**: Wait a few seconds

### NETWORK_ERROR
- **Cause**: Connection issue
- **Fix**: Check internet, check Supabase status

---

## Quick Fixes

### Clear Everything and Start Fresh:
```
1. Open CleanupTool
2. Delete your test user
3. Hard refresh browser
4. Sign up again
```

### Reset Auth State:
```
1. Log out
2. Clear browser cache
3. Close browser
4. Open browser
5. Go to /login
6. Sign in again
```

### Force Navigation:
```javascript
// In browser console:
window.location.href = "/login"  // Go to login
window.location.href = "/dashboard/overview"  // Go to dashboard
```

### Check Auth State:
```javascript
// In browser console:
localStorage.getItem("supabase.auth.token")  // Should have token
```

---

## Prevention Tips

### For Testing:
1. Use email aliases: `email+test1@gmail.com`
2. Use CleanupTool between tests
3. Keep console open to catch errors early
4. Use Route Debugger to verify state
5. Hard refresh after major changes

### For Development:
1. Check console regularly
2. Test in incognito for fresh state
3. Verify database after each operation
4. Use meaningful test data
5. Document any workarounds

### For Production:
1. Handle all error cases
2. Provide helpful error messages
3. Log errors for debugging
4. Test all user flows
5. Have rollback plan

---

## Still Having Issues?

### Information to Gather:

1. **What were you doing?**
   - Exact steps to reproduce
   - What did you click?
   - What did you expect?

2. **What error did you see?**
   - Exact error message
   - Screenshot if possible
   - Console errors

3. **What's your state?**
   - Route Debugger info
   - Are you logged in?
   - What page are you on?

4. **What's in the logs?**
   - Browser console errors
   - Network tab failures
   - Any stack traces

### Where to Look:

- **Browser Console**: F12 → Console
- **Network Tab**: F12 → Network
- **Route Debugger**: Bottom-left corner
- **Supabase Logs**: Supabase Dashboard → Logs
- **Documentation**: Check .md files in project root

---

## Summary of All Fixes

✅ **404 Errors** - Fixed all routing issues  
✅ **Duplicate Email** - Enhanced error handling  
✅ **Forgot Password** - Changed to helpful message  
✅ **Navigation Flow** - AuthContext handles automatically  
✅ **Error Messages** - Clear and actionable  
✅ **Debug Tools** - Route Debugger + CleanupTool  

---

**Your GACE application now has robust error handling and debugging tools!**

Most common issues are now prevented or have clear resolution paths.

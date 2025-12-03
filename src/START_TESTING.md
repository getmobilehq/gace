# 🧪 Start Testing Signup - Quick Start Guide

**Follow these steps to test if individual account creation is working**

---

## ⚡ Quick Start (5 minutes)

### Step 1: Open the App
```bash
# Make sure the app is running
npm run dev
```

### Step 2: Open Browser
1. Navigate to: `http://localhost:5173/signup`
2. **Press F12** to open Developer Tools
3. Click on the **Console** tab
4. ✅ Check the **"Preserve log"** checkbox (important!)
5. Clear any existing logs

### Step 3: Look for the Test Helper
In the bottom-right corner of the screen, you should see:
- **🔧 Test Helper** button

Click it to see:
- ✅ Project ID
- ✅ Server Health (should be green/ok)
- ✅ Quick links to Supabase dashboard

**If Server Health shows RED/error:**
- Server is not deployed or not accessible
- See `/DEBUG_SIGNUP.md` for fixes

### Step 4: Fill Out the Signup Form

```
Full Name: Test User
Email: test123@example.com
User Type: Individual / End User
Password: password123
Confirm Password: password123
```

### Step 5: Click "Create Account"

Watch the console. You should see:

✅ **SUCCESS PATTERN:**
```
=== SIGNUP STARTED ===
Email: test123@example.com
User Type: end-user
Full Name: Test User
Starting signup for: test123@example.com as end-user
Auth user created successfully: abc-123-xyz
Creating profile via server endpoint...
Profile created successfully: { id: "abc-123-xyz", ... }
=== SIGNUP SUCCESSFUL ===
```

❌ **FAILURE PATTERN:**
```
=== SIGNUP FAILED ===
Error: <some error message>
```

### Step 6: Check the Result

**If successful:**
- Page automatically redirects to `/onboarding`
- You see a welcome screen

**If failed:**
- Error message shows on the signup page
- Look at console for details (red text)
- Copy the error and check `/DEBUG_SIGNUP.md`

---

## 🔍 Common Issues & Quick Fixes

### ❌ "404 on /auth/create-profile"
**Fix**: Deploy the edge function
```bash
supabase functions deploy server
```

### ❌ "relation 'user_profiles' does not exist"
**Fix**: Create database tables
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `/supabase/setup.sql`
3. Paste and run

### ❌ "Test Helper shows red/error"
**Problem**: Server is not accessible
**Check**:
- Is Supabase project active? (Free tier pauses after 1 week)
- Is Project ID correct in `/utils/supabase/info.tsx`?
- Is edge function deployed?

### ❌ "For security purposes, you can only request this after 4 seconds"
**Fix**: Wait 5-10 seconds and try again
**Note**: This is normal if you clicked button multiple times

---

## ✅ What to Report

### If it WORKS:
✅ Just say "It works!" - we're done!

### If it FAILS:
Copy and share:

1. **The error from console** (red text)
2. **Network tab** - Any failed requests (404, 500, etc.)
3. **Test Helper status** - What does it show?

Example:
```
Error in console:
POST https://xyz.supabase.co/functions/v1/.../auth/create-profile 404

Test Helper shows:
Server Health: ❌ Server returned 404

Network tab:
POST /auth/create-profile - Status 404
```

---

## 📊 What Success Looks Like

After successful signup, you should see ALL of these:

- ✅ Console shows `=== SIGNUP SUCCESSFUL ===`
- ✅ Page redirects to `/onboarding`
- ✅ No red errors in console
- ✅ Network tab shows 200/201 for both requests
- ✅ User appears in Supabase Dashboard → Authentication → Users
- ✅ Profile appears in Database → user_profiles table

---

## 🚀 Ready to Test?

1. Open `http://localhost:5173/signup`
2. Open Console (F12)
3. Click "🔧 Test Helper" button
4. Check server health is green
5. Fill form and submit
6. Watch console for `=== SIGNUP STARTED ===`

**Report back what you see!**

---

**Need more help?** See `/DEBUG_SIGNUP.md` for detailed troubleshooting

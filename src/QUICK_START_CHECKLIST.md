# GACE - Quick Start Checklist ✅

## Getting Started

### First Time Setup
- [ ] Open browser to your GACE application
- [ ] You should see `/login` page
- [ ] Look for Route Debugger in bottom-left corner
- [ ] Verify it shows "Not Logged In"

---

## Option A: Sign Up (New User)

### Step 1: Navigate to Signup
- [ ] Click "Sign up" link on login page
- [ ] Should navigate to `/signup`
- [ ] Form should be visible with all fields

### Step 2: Fill Out Form
- [ ] Enter full name
- [ ] Enter email address
- [ ] Select user type (end-user, accountant, or admin)
- [ ] If accountant: Enter company name
- [ ] Enter password (min 6 characters)
- [ ] Confirm password

### Step 3: Submit
- [ ] Click "Create Account"
- [ ] Wait for processing
- [ ] Should NOT see any errors

### Step 4: Automatic Redirect
- [ ] Should redirect to `/onboarding/{user_type}`
- [ ] Should see onboarding form
- [ ] Route Debugger shows "Logged In" + "Onboarded: No"

### Step 5: Complete Onboarding
- [ ] Fill out jurisdiction info
- [ ] Add at least one asset (or skip)
- [ ] Click "Complete Onboarding"
- [ ] Should redirect to `/dashboard/overview`
- [ ] Route Debugger shows "Onboarded: Yes"

✅ **Done!** You're now in the dashboard.

---

## Option B: Sign In (Existing User)

### Step 1: Navigate to Login
- [ ] Open app → Should show `/login` page
- [ ] Or click "Sign in" link if on signup page

### Step 2: Enter Credentials
- [ ] Enter your email
- [ ] Enter your password
- [ ] Click "Sign In"

### Step 3: Automatic Redirect
**If NOT onboarded yet:**
- [ ] Redirects to `/onboarding/{user_type}`
- [ ] Complete onboarding steps
- [ ] Redirects to dashboard

**If already onboarded:**
- [ ] Redirects directly to `/dashboard/overview`
- [ ] See dashboard content

✅ **Done!** You're in the dashboard.

---

## If You See Errors

### "Email already registered"
- [ ] See error message with email
- [ ] See action buttons appear:
  - [ ] "Go to Login Page" button visible
  - [ ] "Try a different email" button visible
  - [ ] "Sign In Instead" button visible
- [ ] Click appropriate button
- [ ] Follow the flow

**To Delete Test Account:**
- [ ] Look for red "Delete Test User" box (top-right)
- [ ] Enter email to delete
- [ ] Click "Delete User"
- [ ] Wait for success message
- [ ] Try signup again

### "Invalid email or password"
- [ ] Double-check email spelling
- [ ] Verify password (case-sensitive)
- [ ] Try signing up if no account exists

### Database Setup Required
- [ ] DatabaseSetupGuide should appear
- [ ] Follow SQL instructions
- [ ] Run in Supabase dashboard
- [ ] Refresh page
- [ ] Try again

### 404 Error
- [ ] Hard refresh: Ctrl+Shift+R (Win) or Cmd+Shift+R (Mac)
- [ ] Check Route Debugger for current path
- [ ] Verify URL matches valid route
- [ ] Check browser console for errors

---

## Using the Dashboard

### Navigate Sections
- [ ] Click sidebar links to navigate
- [ ] All links should work without 404
- [ ] Active section highlighted
- [ ] Content loads properly

### Available Sections:
- [ ] Compliance Overview
- [ ] Asset Manager
- [ ] Document Ingestion
- [ ] Global Asset Scanner
- [ ] ML Tax Engine
- [ ] Compliance Alerts
- [ ] HMRC Reports
- [ ] Help & Documentation

### Test Features:
- [ ] View asset summaries
- [ ] Check compliance alerts
- [ ] Upload documents
- [ ] Run tax calculations
- [ ] Generate reports

---

## Debugging Tools

### Route Debugger (Bottom-Left)
- [ ] Visible on screen
- [ ] Shows current path
- [ ] Shows auth status
- [ ] Shows user info (when logged in)
- [ ] Shows onboarding status

**What to Check:**
- ✓ = Logged in correctly
- ✗ = Not logged in (expected on login/signup pages)
- Path matches where you think you are
- Onboarding status correct

### Browser Console (F12)
- [ ] Open with F12 key
- [ ] Switch to Console tab
- [ ] Should see logs like:
  ```
  === ROUTE DEBUG ===
  Current Path: /dashboard/overview
  Auth: Yes
  User: your@email.com
  ```
- [ ] Red errors? → Check TROUBLESHOOTING_GUIDE.md

### CleanupTool (Signup Page Only)
- [ ] Visible in top-right corner
- [ ] Can enter email
- [ ] Can click "Delete User"
- [ ] Shows success/error messages

---

## Testing Checklist

### Test Signup Flow
- [ ] Navigate to `/signup`
- [ ] Fill form with NEW email
- [ ] Submit form
- [ ] No errors
- [ ] Redirects to onboarding
- [ ] Complete onboarding
- [ ] Redirects to dashboard

### Test Login Flow
- [ ] Log out from dashboard
- [ ] Navigate to `/login`
- [ ] Enter credentials
- [ ] Submit form
- [ ] No errors
- [ ] Redirects to dashboard (if onboarded)

### Test Duplicate Email Handling
- [ ] Navigate to `/signup`
- [ ] Fill form with EXISTING email
- [ ] Submit form
- [ ] See clear error message
- [ ] See action buttons
- [ ] Click "Go to Login Page"
- [ ] Navigates to `/login`
- [ ] Can login successfully

### Test Navigation
- [ ] Click each sidebar link
- [ ] No 404 errors
- [ ] Content loads
- [ ] URL updates correctly
- [ ] Route Debugger shows correct path

### Test Logout
- [ ] Click "Log out" in header
- [ ] Redirects to `/login`
- [ ] Route Debugger shows "Not Logged In"
- [ ] Can't access dashboard URLs without auth

---

## Common Issues Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| **404 Error** | Hard refresh (Ctrl+Shift+R) |
| **Duplicate Email** | Use Login or CleanupTool |
| **Can't Login** | Check console, verify credentials |
| **Stuck Loading** | Wait 5-10s, then refresh |
| **Database Error** | Follow DatabaseSetupGuide |
| **Form Won't Submit** | Check console for validation errors |
| **Route Debugger Gone** | Refresh page |
| **Wrong Dashboard** | Log out and log back in |

---

## Verification

### Everything Working If:
- ✅ Can sign up without errors
- ✅ Can login without errors
- ✅ Onboarding flow works
- ✅ Dashboard loads properly
- ✅ All sidebar links work (no 404)
- ✅ Route Debugger shows correct info
- ✅ Console has no red errors
- ✅ Can logout and login again

### Still Have Issues?
1. Check **TROUBLESHOOTING_GUIDE.md**
2. Check **ERROR_FIX_SUMMARY.md**
3. Check **ROUTE_FIX_SUMMARY.md**
4. Check browser console
5. Check Route Debugger info

---

## Pro Tips

### For Testing:
- ✨ Use email aliases: `your@email+test1.com`
- ✨ Keep CleanupTool handy
- ✨ Watch Route Debugger while navigating
- ✨ Keep console open

### For Demos:
- ✨ Create one test account and reuse it
- ✨ Complete onboarding before demo
- ✨ Test all flows before presenting
- ✨ Have backup account ready

### For Development:
- ✨ Test in incognito for fresh state
- ✨ Use meaningful test data
- ✨ Hard refresh after code changes
- ✨ Check console after every action

---

## Summary

| Task | Status | Notes |
|------|--------|-------|
| **Signup** | ✅ Enhanced | Clear error messages + action buttons |
| **Login** | ✅ Working | Auto-redirects based on state |
| **Routing** | ✅ Fixed | No more 404 errors |
| **Onboarding** | ✅ Working | Auto-navigation flow |
| **Dashboard** | ✅ Working | All sections accessible |
| **Error Handling** | ✅ Enhanced | Clear messages + guidance |
| **Debug Tools** | ✅ Added | Route Debugger + CleanupTool |

---

**Your GACE application is ready to use! 🎉**

Follow this checklist to verify everything works correctly.

# 🧪 Test the Authentication Fix

## ✅ What Was Fixed

1. **API Client** - Now gets user's access token from session instead of always using anon key
2. **AssetManager** - Only loads assets when user is authenticated
3. **Added Debug Logs** - To see what token type is being used

---

## 🚀 Test Now

### **Step 1: Open Browser Console**
Press `F12` or right-click → Inspect → Console tab

### **Step 2: Refresh Page**
Just refresh your browser (or go to http://localhost:5173)

### **Step 3: Check Console Logs**

You should now see:
```
[AssetManager] No user session, skipping asset load
```

This means the component is NOT trying to call the API when there's no user!

---

## ✅ Test Login Flow

### **Test A: Sign In (If You Have Account)**

1. Go to: http://localhost:5173/login
2. Sign in with your credentials
3. Check console for these logs:

```
[API Client] Getting access token...
[API Client] Session exists: true
[API Client] Access token exists: true
[API Client] Using token type: USER ACCESS TOKEN
```

4. ✅ **Expected:** Dashboard loads, assets are fetched successfully

---

### **Test B: Sign Up (New Account)**

1. Go to: http://localhost:5173/signup
2. Fill out the form:
   - Email: test@example.com
   - Password: TestPassword123!
   - Full Name: Test User
   - User Type: Individual

3. Submit and watch console

4. After signup, you'll be redirected to onboarding

5. Complete onboarding and go to dashboard

6. Check console logs:
```
[API Client] Session exists: true
[API Client] Using token type: USER ACCESS TOKEN
```

7. ✅ **Expected:** No "Unauthorized" errors

---

## 🔍 What To Look For

### **✅ SUCCESS Indicators:**
- `[API Client] Using token type: USER ACCESS TOKEN` when logged in
- `[AssetManager] No user session, skipping asset load` when not logged in
- Dashboard components load without errors
- No "Failed to load assets: Unauthorized" errors

### **❌ FAILURE Indicators:**
- `[API Client] Using token type: ANON KEY` when you ARE logged in (bad!)
- "Failed to load assets: Unauthorized" error
- "invalid claim: missing sub claim" in server logs

---

## 🐛 If Still Seeing Errors

### **Scenario 1: Still seeing "Using token type: ANON KEY" when logged in**

**Cause:** Session isn't being stored properly

**Fix:**
1. Sign out completely
2. Clear browser storage:
   ```javascript
   // In console:
   localStorage.clear()
   sessionStorage.clear()
   ```
3. Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
4. Sign in again

---

### **Scenario 2: "Session exists: false" when you ARE logged in**

**Cause:** Auth context not initialized

**Fix:**
1. Check if you're actually logged in:
   ```javascript
   // In console:
   const supabase = window.location.origin
   console.log("Check cookies:", document.cookie)
   ```
2. If no cookies, you're not logged in - sign in again

---

### **Scenario 3: Still getting "Unauthorized" on specific pages**

**Cause:** Component mounting before auth context loads

**Check:** Which component is failing?
- If AssetManager: Already fixed ✅
- If another component: Let me know which one

---

## 📝 Quick Debugging Commands

### **Check Session in Console:**
```javascript
// Paste in browser console
import { createClient } from '@supabase/supabase-js';
const supabase = createClient('YOUR_URL', 'YOUR_KEY');
supabase.auth.getSession().then(({data}) => console.log('Session:', data));
```

### **Check Auth Status:**
Open React DevTools → Components → Find `AuthContext` → Check state

---

## 🎯 Expected Behavior

### **When NOT Logged In:**
- ✅ API client uses anon key
- ✅ AssetManager skips loading
- ✅ No "Unauthorized" errors
- ✅ Login/Signup pages work fine

### **When Logged In:**
- ✅ API client uses user access token
- ✅ AssetManager loads assets
- ✅ Dashboard components work
- ✅ No auth errors

---

## ✅ Success Criteria

After testing, you should be able to:
- [ ] Load signup page without errors
- [ ] Create account successfully
- [ ] Complete onboarding
- [ ] Access dashboard
- [ ] See AssetManager (empty or with assets)
- [ ] Console shows "USER ACCESS TOKEN" when logged in
- [ ] Console shows "ANON KEY" when NOT logged in
- [ ] No "Unauthorized" or "invalid claim" errors

---

## 🚀 Ready to Test!

**Just refresh your browser and check the console!**

If you see `[AssetManager] No user session, skipping asset load` on the signup page, that's **PERFECT** - it means the fix is working! ✅

Then try signing in and verify that assets load successfully on the dashboard.

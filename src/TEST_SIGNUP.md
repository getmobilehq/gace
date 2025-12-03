# GACE - Signup Testing Checklist

**Follow these steps to test individual account creation**

---

## ✅ Pre-Test Setup

### Step 1: Verify Edge Function is Deployed

```bash
supabase functions list
```

**Expected output:**
```
┌─────────┬─────────────┬────────────┬─────────────────────┐
│ name    │ version     │ status     │ created_at          │
├─────────┼─────────────┼────────────┼─────────────────────┤
│ server  │ v1          │ deployed   │ 2024-11-30 10:00:00 │
└─────────┴─────────────┴────────────┴─────────────────────┘
```

**If not deployed:**
```bash
supabase functions deploy server
```

---

### Step 2: Test Health Endpoint

```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-b5fd51b8/health
```

**Expected response:**
```json
{"status":"ok","timestamp":"2024-11-30T10:00:00.000Z"}
```

**If you get 404:** Edge function is not deployed or URL is wrong.

---

### Step 3: Verify Database Tables Exist

Go to Supabase Dashboard → SQL Editor and run:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'assets', 'documents', 'tax_calculations', 'compliance_alerts')
ORDER BY table_name;
```

**Expected result:** All 5 tables listed.

**If tables missing:** Run `/supabase/setup.sql` in SQL Editor.

---

## 🧪 Test Case 1: Individual User Signup

### Test Data:
```
Full Name: John Smith
Email: john.smith.test@example.com
User Type: Individual / End User
Password: TestPassword123!
Confirm Password: TestPassword123!
```

### Steps:

1. **Open browser in incognito/private mode** (ensures clean state)

2. **Open Developer Console (F12)**
   - Go to Console tab
   - Check "Preserve log" checkbox
   - Clear any existing logs

3. **Navigate to signup page:**
   ```
   http://localhost:5173/signup
   ```

4. **Fill in the form** with test data above

5. **Click "Create Account"**

6. **Watch the console for this output:**

   ✅ **SUCCESS - You should see:**
   ```
   === SIGNUP STARTED ===
   Email: john.smith.test@example.com
   User Type: end-user
   Full Name: John Smith
   Company Name: N/A
   Starting signup for: john.smith.test@example.com as end-user
   Auth user created successfully: <user-id>
   Creating profile via server endpoint...
   Profile created successfully: { id: "...", full_name: "John Smith", ... }
   === SIGNUP SUCCESSFUL ===
   Auth state changed: logged in
   Loading user profile for ID: <user-id>
   ✅ Profile loaded successfully: { ... }
   ```

   ❌ **FAILURE - You might see:**
   ```
   === SIGNUP FAILED ===
   Error: <error details>
   ```

7. **Check Network Tab**
   - Go to Network tab in DevTools
   - Filter by "Fetch/XHR"
   - Look for these requests:
     - `POST /auth/v1/signup` → Status 200 ✅
     - `POST /functions/v1/make-server-b5fd51b8/auth/create-profile` → Status 200/201 ✅

8. **Expected behavior after signup:**
   - Page redirects to `/onboarding`
   - You see welcome screen with user's name
   - "Complete your profile" or asset setup wizard

---

## 🧪 Test Case 2: Accountant Signup

### Test Data:
```
Full Name: Jane Accountant
Email: jane.accountant@example.com
User Type: Accountant / Tax Professional
Company Name: Smith & Co Accounting
Password: TestPassword123!
Confirm Password: TestPassword123!
```

### Steps:
Same as Test Case 1, but:
- User Type: Select "Accountant / Tax Professional"
- Company Name field should appear - fill it in
- Expected redirect: `/onboarding/accountant`

---

## 🧪 Test Case 3: Admin Signup

### Test Data:
```
Full Name: Admin User
Email: admin.test@example.com
User Type: Administrator
Password: TestPassword123!
Confirm Password: TestPassword123!
```

### Steps:
Same as Test Case 1, but:
- User Type: Select "Administrator"
- Expected redirect: `/admin/dashboard` (no onboarding)
- Should have full admin access

---

## 🧪 Test Case 4: Duplicate Email (Error Handling)

### Test Data:
```
Email: john.smith.test@example.com (already used in Test Case 1)
```

### Expected behavior:
- Error message: "This email is already registered"
- Form stays on signup page
- No account created

---

## 🧪 Test Case 5: Rate Limiting (Error Handling)

### Steps:
1. Fill in signup form
2. **Click "Create Account" button 5 times rapidly**

### Expected behavior:
- First click: Processes normally
- Subsequent clicks: Button disabled
- Error message: "Please wait X seconds before trying again"
- Cooldown timer displayed

---

## 🔍 Verification Checks

### Check 1: Verify User in Supabase Auth

1. Go to Supabase Dashboard
2. Click **Authentication** → **Users**
3. Find the user you just created
4. Click on the user
5. Check **User Metadata** section:
   ```json
   {
     "full_name": "John Smith",
     "user_type": "end-user",
     "company_name": null
   }
   ```

### Check 2: Verify Profile in Database

Go to Supabase Dashboard → SQL Editor:

```sql
SELECT 
  id,
  email,
  full_name,
  user_type,
  company_name,
  has_completed_onboarding,
  created_at
FROM user_profiles
WHERE email = 'john.smith.test@example.com';
```

**Expected result:**
| id | email | full_name | user_type | company_name | has_completed_onboarding | created_at |
|----|-------|-----------|-----------|--------------|--------------------------|------------|
| abc-123 | john.smith.test@example.com | John Smith | end-user | null | false | 2024-11-30... |

### Check 3: Check Edge Function Logs

```bash
supabase functions logs server --tail 50
```

**Look for:**
```
Creating user profile for: john.smith.test@example.com
Profile created successfully
```

---

## 📊 Test Results Table

Fill this in as you test:

| Test Case | Expected Result | Actual Result | Status |
|-----------|----------------|---------------|--------|
| 1. Individual signup | Account created, redirected to onboarding | | ⬜ |
| 2. Accountant signup | Account created, company name saved | | ⬜ |
| 3. Admin signup | Account created, redirected to dashboard | | ⬜ |
| 4. Duplicate email | Error message shown | | ⬜ |
| 5. Rate limiting | Cooldown enforced | | ⬜ |

---

## ❌ Common Errors & Fixes

### Error: 404 on /auth/create-profile

**Cause:** Edge function not deployed

**Fix:**
```bash
supabase functions deploy server
```

---

### Error: "relation 'user_profiles' does not exist"

**Cause:** Database tables not created

**Fix:** Run `/supabase/setup.sql` in Supabase SQL Editor

---

### Error: CORS error

**Cause:** Server CORS not configured

**Fix:** Check `/supabase/functions/server/index.tsx` has:
```typescript
app.use('/*', cors({ origin: '*' }));
```

---

### Error: "For security purposes, you can only request this after 4 seconds"

**Cause:** Supabase rate limiting

**Fix:** Wait 5 seconds and try again

---

## ✅ Success Criteria

**Signup is working correctly if:**

- ✅ All 3 user types can sign up
- ✅ Profile is created in database
- ✅ User is redirected to correct page
- ✅ Duplicate email shows error
- ✅ Rate limiting prevents spam
- ✅ No console errors
- ✅ Network requests return 200/201

---

## 🐛 If Tests Fail

1. **Copy all console logs** (including errors in red)
2. **Copy Network tab** request/response for failed calls
3. **Check edge function logs:** `supabase functions logs server`
4. **Refer to:** `/DEBUG_SIGNUP.md` for detailed troubleshooting

---

**Ready to test?** 

Start with Test Case 1 (Individual User) and let me know what you see in the console!

---

**Last Updated:** 2024-11-30

# ✅ GACE Setup Checklist

## 🎯 Complete These Steps in Order

---

### ☐ Step 1: Run Database Setup (REQUIRED!)

**Status:** ⚠️ NOT DONE - This is why you're getting errors!

**What to do:**
1. Open: https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/sql
2. Click "New query"
3. Open `/supabase/setup.sql` in your code editor
4. Copy EVERYTHING (Ctrl+A, Ctrl+C)
5. Paste into Supabase (Ctrl+V)
6. Click "Run"
7. Wait for "Success"

**How to verify:**
- Go to: https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/editor
- You should see 5 tables:
  - ✅ user_profiles
  - ✅ assets
  - ✅ documents
  - ✅ tax_calculations
  - ✅ compliance_alerts

**Read:** `/DATABASE_SETUP.md` for detailed instructions

---

### ☐ Step 2: Start Dev Server

**What to do:**
```bash
npm install  # If you haven't already
npm run dev
```

**How to verify:**
- Browser opens to `http://localhost:5173`
- You see the GACE login page

---

### ☐ Step 3: Create Your First Account

**What to do:**
1. Go to: `http://localhost:5173/signup`
2. Fill in:
   ```
   Full Name: Demo User
   Email: demo@gace.app
   Password: demo123456
   Confirm Password: demo123456
   User Type: Individual / End User
   ```
3. Click "Create Account"

**How to verify:**
- ✅ No error messages
- ✅ Redirects to `/onboarding/end-user`
- ✅ You see the onboarding wizard

---

### ☐ Step 4: Complete Onboarding

**What to do:**
1. Click through the onboarding steps
2. On the last step, click "Complete Setup"

**How to verify:**
- ✅ Redirects to `/dashboard/overview`
- ✅ You see your dashboard
- ✅ Your name appears in the top right

---

### ☐ Step 5: Test Logout & Login

**What to do:**
1. Click "Log out" (top right corner)
2. Go to: `http://localhost:5173/login`
3. Enter:
   ```
   Email: demo@gace.app
   Password: demo123456
   ```
4. Click "Sign In"

**How to verify:**
- ✅ Goes straight to dashboard (skips onboarding)
- ✅ All your data is still there

---

### ☐ Step 6: Test Asset Manager

**What to do:**
1. Click "Asset Manager" in sidebar
2. Click "Add Asset" button
3. Fill in:
   ```
   Asset Type: Property
   Country: Nigeria
   Description: Test Property
   Value (GBP): 50000
   ```
4. Click "Create Asset"

**How to verify:**
- ✅ Asset appears in the list
- ✅ Charts update with new data
- ✅ Analytics cards show correct totals
- ✅ Can edit the asset
- ✅ Can delete the asset

---

### ☐ Step 7: Explore Other Features

**What to test:**

**Document Upload:**
- Go to: `/dashboard/documents`
- Try uploading a file

**Tax Calculator:**
- Go to: `/dashboard/tax-engine`
- Enter some income data
- Calculate taxes

**Compliance Alerts:**
- Go to: `/dashboard/alerts`
- View alerts

---

## 🚨 If You Get Stuck

### Error: "Could not find table 'user_profiles'"

**You skipped Step 1!** Go run the database setup:
- Read: `/DATABASE_SETUP.md`
- Or: `/RUN_THIS_FIRST.md`

### Error: "Invalid login credentials"

**You haven't created an account yet!** Go to Step 3:
- Navigate to: `http://localhost:5173/signup`
- Create a new account

### Signup doesn't work

**Make sure you completed Step 1!**
- Verify tables exist in Supabase Table Editor
- Check browser console (F12) for errors
- Re-run the SQL setup if needed

---

## 📊 Progress Tracker

Mark your progress:

```
[✅] Step 1: Database Setup
[✅] Step 2: Dev Server Running  
[✅] Step 3: Account Created
[✅] Step 4: Onboarding Complete
[✅] Step 5: Login Works
[✅] Step 6: Asset Manager Works
[✅] Step 7: Features Explored
```

When all checked: **🎉 YOU'RE DONE!**

---

## 🎯 Quick Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open in browser
# http://localhost:5173
```

---

## 📚 Helpful Links

**Supabase Dashboard:**
- Project: https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb
- SQL Editor: https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/sql
- Table Editor: https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/editor
- Auth Users: https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/auth/users

**Local App:**
- Login: http://localhost:5173/login
- Signup: http://localhost:5173/signup
- Dashboard: http://localhost:5173/dashboard/overview
- Assets: http://localhost:5173/dashboard/assets

---

## 📖 Documentation

- **Start Here:** `/RUN_THIS_FIRST.md`
- **Database Setup:** `/DATABASE_SETUP.md`
- **Quick Start:** `/QUICK_START.md`
- **Auth Troubleshooting:** `/AUTH_FIX_GUIDE.md`
- **Features Overview:** `/FEATURES_COMPLETE.md`

---

## 💡 Demo Credentials

After completing signup:

```
Email: demo@gace.app
Password: demo123456
```

Use these for testing and presentations.

---

## 🔥 Most Common Mistake

**90% of setup issues = Not running Step 1!**

If you're getting ANY errors with signup or login:
1. Go to Supabase SQL Editor
2. Run the `/supabase/setup.sql` script
3. Try again

**That's it!** 🎯

---

## ✅ You're Ready When...

- [ ] Can sign up without errors
- [ ] Can login and see dashboard
- [ ] Can create and view assets
- [ ] Can logout and login again
- [ ] Data persists after refresh

**All checked? Perfect! Start building!** 🚀

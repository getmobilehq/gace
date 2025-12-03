# 🗄️ Database Setup - REQUIRED FIRST STEP

## ⚠️ Current Error:

```
Error: Could not find the table 'public.user_profiles' in the schema cache
```

**Translation:** The database tables don't exist yet. You need to create them!

---

## ✅ Fix: Run This SQL Script (2 Minutes)

### **Option 1: Quick Link Method** (Easiest!)

1. **Click this link:**
   ```
   https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/sql/new
   ```

2. **In your code editor, open:**
   ```
   /supabase/setup.sql
   ```

3. **Copy EVERYTHING** (Ctrl+A, then Ctrl+C)

4. **Paste into Supabase** (Ctrl+V)

5. **Click "Run"** (big green button)

6. **Wait for "Success"** ✅

**DONE!** Now try signing up again.

---

### **Option 2: Step-by-Step Method**

#### Step 1: Open Supabase
- Go to: https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb
- Click "SQL Editor" in left sidebar
- Click "New query" button

#### Step 2: Copy SQL
- Open `/supabase/setup.sql` in your code editor
- Select all (Ctrl+A)
- Copy (Ctrl+C)

#### Step 3: Paste & Run
- Paste into Supabase SQL editor (Ctrl+V)
- Click "Run" button
- Wait for "Success. No rows returned"

#### Step 4: Verify
You should see at the bottom:
```
✅ assets
✅ compliance_alerts  
✅ documents
✅ tax_calculations
✅ user_profiles
```

If you see these 5 tables, **YOU'RE DONE!**

---

## 🧪 Test It Worked

1. **Go to signup:** http://localhost:5173/signup

2. **Create account:**
   ```
   Email: test@gace.app
   Password: test123456
   Name: Test User
   Type: Individual / End User
   ```

3. **Click "Create Account"**

4. **Expected result:**
   - ✅ No errors
   - ✅ Redirects to onboarding
   - ✅ You can complete onboarding
   - ✅ Dashboard loads

---

## 📊 What This Script Does

The SQL script creates 5 tables:

1. **user_profiles** - Stores user data
2. **assets** - Tracks global assets (property, investments, etc.)
3. **documents** - Uploaded files and OCR data
4. **tax_calculations** - Tax calculation history
5. **compliance_alerts** - Notifications and deadlines

Plus:
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for fast queries
- ✅ Triggers for auto-updating timestamps
- ✅ Constraints for data validation

---

## 🔍 Verify Tables Exist

After running the SQL, check the Table Editor:

**Link:** https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/editor

You should see 5 tables listed in the left sidebar.

Click on `user_profiles` - you should see columns like:
- id
- email
- user_type
- full_name
- has_completed_onboarding

---

## 🐛 Common Issues

### "Table already exists"

**Good!** Tables are already there. Just try signing up again.

### "Permission denied"

Make sure you're logged into Supabase with the right account.

### "Failed to fetch"

Check if your Supabase project is paused:
- https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb
- Look for "Project paused" banner
- Click "Restore" if paused

### SQL runs but signup still fails

1. Check browser console (F12) for errors
2. Verify 5 tables exist in Table Editor
3. Try a different email address
4. Make sure dev server is running (`npm run dev`)

---

## 📝 Technical Details

### Why do I need to run this?

Your app uses Supabase as a database. When you sign up, the app tries to save your profile to the `user_profiles` table. If that table doesn't exist, you get an error.

### Do I need to run this more than once?

**No!** Once you run the SQL script, the tables are created permanently. You only need to run it:
- On first setup
- If you delete the tables
- If you reset your database

### Is my data safe?

Yes! The script includes Row Level Security (RLS) policies, which means:
- Users can only see their own data
- Users can't access other users' data
- Admin users have appropriate access controls

---

## ✅ Success Checklist

- [ ] Opened Supabase SQL Editor
- [ ] Pasted entire `/supabase/setup.sql` script
- [ ] Clicked "Run" and saw "Success"
- [ ] Verified 5 tables exist in Table Editor
- [ ] Tested signup - it works!
- [ ] Completed onboarding
- [ ] Logged in successfully

**All checked?** You're ready to use GACE! 🎉

---

## 🚀 Next Steps After Setup

Once the database is set up:

1. ✅ **Create your account** via signup page
2. ✅ **Complete onboarding** 
3. ✅ **Explore the dashboard**
4. ✅ **Add your first asset** (`/dashboard/assets`)
5. ✅ **Upload a document** (`/dashboard/documents`)
6. ✅ **Calculate taxes** (`/dashboard/tax-engine`)

---

## 📞 Still Need Help?

If you're stuck:

1. Check `/RUN_THIS_FIRST.md` for detailed walkthrough
2. Check `/AUTH_FIX_GUIDE.md` for troubleshooting
3. Check browser console (F12) for error messages
4. Verify Supabase project isn't paused

---

## 🎯 Quick Reference

**SQL Editor:** https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/sql  
**Table Editor:** https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/editor  
**SQL File:** `/supabase/setup.sql`  

**Test Credentials (after signup):**
```
Email: demo@gace.app
Password: demo123456
```

---

**⚡ The TLDR:**
1. Open Supabase SQL Editor
2. Paste `/supabase/setup.sql` 
3. Click "Run"
4. Sign up
5. Done! ✅

# 🚨 STOP! RUN THIS FIRST! 🚨

## You're getting this error because the database tables don't exist yet!

```
Error: Could not find the table 'public.user_profiles' in the schema cache
```

## ✅ SOLUTION: Run the SQL Setup (Takes 2 minutes)

---

## Step 1: Open Supabase SQL Editor

Click this link (or copy and paste into your browser):

```
https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/sql
```

You should see the Supabase dashboard with an SQL editor.

---

## Step 2: Create New Query

Click the **"New query"** button in the top right.

---

## Step 3: Copy the SQL Script

1. In your code editor, open this file:
   ```
   /supabase/setup.sql
   ```

2. Select ALL the content (Ctrl+A or Cmd+A)

3. Copy it (Ctrl+C or Cmd+C)

---

## Step 4: Paste and Run

1. Go back to the Supabase SQL Editor tab

2. Paste the SQL (Ctrl+V or Cmd+V)
   - You should see ~260 lines of SQL

3. Click the **"Run"** button (or press Ctrl+Enter / Cmd+Enter)

4. Wait for it to complete (2-5 seconds)

5. You should see: **"Success. No rows returned"** ✅

---

## Step 5: Verify Tables Were Created

At the bottom of the SQL editor, you should see output showing:

```
table_name
-------------------
assets
compliance_alerts
documents
tax_calculations
user_profiles
```

If you see these 5 tables, **YOU'RE DONE!** ✅

---

## Step 6: Test Signup Again

1. Go to your app: `http://localhost:5173/signup`

2. Fill in the signup form:
   ```
   Full Name: Demo User
   Email: demo@gace.app
   Password: demo123456
   User Type: Individual / End User
   ```

3. Click "Create Account"

4. **It should work now!** ✅

---

## 🎯 Visual Checklist

- [ ] Opened Supabase SQL Editor
- [ ] Clicked "New query"
- [ ] Copied entire /supabase/setup.sql file
- [ ] Pasted into SQL editor
- [ ] Clicked "Run"
- [ ] Saw "Success. No rows returned"
- [ ] Verified 5 tables were created
- [ ] Tested signup - it works!

---

## 🐛 Troubleshooting

### "Permission denied" or "insufficient privileges"

**Solution:** Make sure you're logged into the correct Supabase project.
- Go to: https://supabase.com/dashboard
- Select project: `faczbtutzsrcnlrahifb`
- Try running the SQL again

### "Relation already exists"

**Good news!** This means the tables are already created. You can skip to Step 6 and test signup.

### "Failed to fetch" or network error

**Solution:** Check your internet connection and make sure the Supabase project isn't paused.
- Go to: https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb
- Look for "Project paused" banner
- If paused, click "Restore project"

### Still getting errors?

1. Check browser console (F12) for errors
2. Make sure you're running the dev server: `npm run dev`
3. Clear browser cache and try again
4. Check that all 5 tables exist in the Table Editor:
   - https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/editor

---

## 📸 What Success Looks Like

After running the SQL, you should be able to:

✅ Sign up for an account (no errors!)  
✅ See "Redirecting to onboarding..." message  
✅ Complete onboarding steps  
✅ Land on the dashboard  
✅ Login and logout works  

---

## 💡 Why Did This Happen?

The app tries to save user data to the database, but if the tables don't exist yet, you get the "table not found" error. Running the SQL script creates all the necessary tables, columns, and security policies.

**Think of it like building a filing cabinet before you can store files in it!** 📂

---

## 🆘 Need More Help?

If you're still stuck:

1. **Screenshot the error** in browser console (F12)
2. **Screenshot the Supabase SQL editor** after running the script
3. **Check Table Editor** to see if tables exist:
   - https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/editor

---

## ✅ After This Works

Once you can sign up successfully, explore:

- **Dashboard** - See your compliance overview
- **Asset Manager** - Track global assets (`/dashboard/assets`)
- **Tax Calculator** - Calculate UK tax liability
- **Document Upload** - Process documents with OCR

---

## 🎉 That's It!

**Just run the SQL script once, and you're done forever.**

The tables will stay in your database until you manually delete them.

**GO RUN IT NOW!** ⚡

Direct link: https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/sql

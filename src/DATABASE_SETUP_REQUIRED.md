# ⚠️ DATABASE SETUP REQUIRED

## 🔴 **Critical Error: Database Tables Not Created**

The error you're seeing happens because **the database tables don't exist yet**. 

### Error Explanation:
```
Profile creation error via API: {
  "error": "Failed to create profile"
}
```

This is happening because the `user_profiles` table (and all other tables) haven't been created in your Supabase database.

---

## ✅ **Solution: Run the Database Setup Script**

You need to run the SQL script to create all required tables.

### **Step 1: Open Supabase SQL Editor**

1. Go to: **https://supabase.com/dashboard**
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New query"**

### **Step 2: Copy the Setup Script**

Open the file: `/supabase/setup.sql`

Copy ALL the contents (it's a long file with all table definitions).

### **Step 3: Paste and Run**

1. Paste the entire script into the SQL Editor
2. Click **"Run"** (or press `Ctrl+Enter`)
3. Wait for it to complete (~5-10 seconds)

You should see success messages like:
```
Success. No rows returned
```

---

## 📋 **What Tables Will Be Created?**

The script creates:
- ✅ `user_profiles` - User account information
- ✅ `assets` - User overseas assets
- ✅ `tax_calculations` - Tax calculation history
- ✅ `documents` - Uploaded documents
- ✅ `compliance_alerts` - Compliance notifications

Plus all Row Level Security (RLS) policies for data protection.

---

## 🎯 **After Running the Script**

1. ✅ Verify tables exist:
   - Go to **Table Editor** in Supabase
   - You should see all 5 tables

2. ✅ Try signup again:
   - Go to: `http://localhost:5173/signup`
   - Create a new account
   - It should work now!

---

## 🔍 **How to Verify Tables Exist**

### Option 1: Table Editor
1. Go to Supabase Dashboard
2. Click **"Table Editor"**
3. Check if you see: `user_profiles`, `assets`, `tax_calculations`, `documents`, `compliance_alerts`

### Option 2: SQL Query
Run this in SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see all 5 tables listed.

---

## ⚡ **Quick Link**

Run the script here:
👉 **https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new**

Replace `YOUR_PROJECT_ID` with your actual project ID.

---

## ❓ **Troubleshooting**

**If you get permission errors:**
- Make sure you're using the **project owner account**
- The SQL Editor uses the service role by default

**If tables already exist:**
- The script uses `CREATE TABLE IF NOT EXISTS` so it's safe to run multiple times
- It will only create missing tables

**If you get syntax errors:**
- Make sure you copied the ENTIRE script
- Check that no characters were lost during copy/paste

---

## 🚀 **Ready?**

1. Open: https://supabase.com/dashboard (select your project)
2. Click: **SQL Editor** → **New query**
3. Copy: `/supabase/setup.sql`
4. Paste & Run
5. Try signup again!

Let me know once you've run the script! 🎉

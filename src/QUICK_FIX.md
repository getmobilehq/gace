# GACE - Quick Fix Reference Card

**Most common issues and instant solutions** ⚡

---

## 🔴 "For security purposes, you can only request this after 4 seconds"

```
✅ WAIT: 5-10 seconds before trying again
✅ FIXED: App now has rate limiting built-in
⚠️  DON'T: Click the signup button multiple times
```

---

## 🔴 "User already registered"

```
✅ DO: Sign in instead of signing up
✅ OR: Use a different email address
```

---

## 🔴 "Database setup required"

```bash
# 1. Go to Supabase SQL Editor
# 2. Copy contents of /supabase/setup.sql
# 3. Paste and run
# 4. Refresh page
```

---

## 🔴 "Failed to fetch" / Network error

```bash
# Check if edge functions are deployed:
supabase functions deploy server

# Verify:
supabase functions list

# Test health:
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-b5fd51b8/health
```

---

## 🔴 "RLS policy violation"

```
✅ FIXED: Use server-side profile creation
⚠️  IF STILL HAPPENS: Re-run /supabase/setup.sql
```

---

## 🔴 Blank page / White screen

```
Press F12 → Check Console → Read error
Try: Ctrl/Cmd + Shift + R (hard refresh)
```

---

## 🔴 "Profile not found"

```
✅ AUTO-FIX: App creates profile from auth metadata
⚠️  IF FAILS: Click "Fix Profile" button
⚠️  LAST RESORT: Sign up with different email
```

---

## 🔴 Module not found

```bash
npm install
npm run dev
```

---

## 🔴 Deployment fails

```
1. Check environment variables are set
2. Verify build command: npm run build
3. Verify output directory: dist
4. Test locally: npm run build && npm run preview
```

---

## 🔴 Edge functions 404

```bash
# Deploy:
supabase functions deploy server

# Check logs:
supabase functions logs server
```

---

## 🆘 Nuclear Option (Reset Everything)

```bash
# 1. Sign out of app
# 2. Clear browser cache
# 3. In Supabase dashboard → Authentication → Delete test users
# 4. Re-run setup.sql
# 5. Refresh page
# 6. Sign up again with new email
```

---

## 📋 Pre-Flight Checklist

Before reporting a bug, verify:

```
[ ] Supabase credentials in /utils/supabase/info.tsx are correct
[ ] Database tables exist (run setup.sql)
[ ] Edge functions deployed (supabase functions list)
[ ] Browser console shows no errors
[ ] Internet connection is working
[ ] Supabase project is not paused
```

---

## 🔗 Quick Links

- **Setup Guide**: `/DEPLOYMENT_GUIDE.md`
- **Full Troubleshooting**: `/TROUBLESHOOTING.md`
- **GitHub Issues**: https://github.com/dju78/gace/issues
- **Supabase Status**: https://status.supabase.com

---

**Pro Tip**: Most issues are fixed by waiting a few seconds and trying again! 🕐

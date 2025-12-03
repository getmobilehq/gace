# GACE - Troubleshooting Guide

Common issues and their solutions.

---

## 🔐 Authentication Issues

### ❌ Individual account not creating

**Problem**: Signup form submits but account is not created.

**Solution**: 
✅ **FIXED!** Profile creation now uses server-side endpoint with service role key.

**Detailed debugging**:
1. Open browser console (F12) before attempting signup
2. Look for detailed logs starting with `=== SIGNUP STARTED ===`
3. Check for any red error messages
4. Follow the comprehensive debugging guide: **`/DEBUG_SIGNUP.md`**

**Quick checks**:
- [ ] Edge function deployed: `supabase functions deploy server`
- [ ] Database tables exist: Run `/supabase/setup.sql`
- [ ] Project ID is correct in `/utils/supabase/info.tsx`
- [ ] Browser console shows no 404 errors

**Common causes**:
- Server endpoint not deployed (404 error)
- Database tables don't exist
- Wrong project ID in configuration
- Network/connection issues

See **`/DEBUG_SIGNUP.md`** for complete troubleshooting steps.

---

### ❌ "For security purposes, you can only request this after 4 seconds"

**Problem**: This is Supabase's built-in rate limiting to prevent abuse. It occurs when:
- You click the signup button multiple times quickly
- You attempt to sign up again too soon after a failed attempt
- There's a bug causing duplicate API calls

**Solution**: 
✅ **FIXED!** The application now includes:
- Client-side rate limiting (5-second cooldown)
- Duplicate request prevention
- Clear error messages with countdown timer
- Disabled button state while processing

**What to do if you see this error**:
1. Wait 5-10 seconds before trying again
2. Make sure you only click the "Create Account" button once
3. Check the error message for the exact wait time
4. If the issue persists, refresh the page and try again

---

### ❌ "User already registered"

**Problem**: The email address is already in use.

**Solutions**:
1. **Try signing in** instead of signing up
2. **Use a different email** address
3. **Reset your password** if you forgot it (feature coming soon)

---

### ❌ "Profile not found" or Missing Profile

**Problem**: Your auth account was created, but the profile wasn't created in the database.

**Solutions**:
1. The app will automatically try to create your profile from auth metadata
2. If that fails, you'll see a "Fix Profile" button - click it
3. As a last resort, sign out and sign up again with a different email

---

### ❌ "Database setup required"

**Problem**: The database tables don't exist yet.

**Solutions**:
1. Follow the setup instructions shown in the error modal
2. Go to your Supabase dashboard → SQL Editor
3. Run the SQL script from `/supabase/setup.sql`
4. Refresh the page and try again

**Quick check**:
```sql
-- Run this in Supabase SQL Editor to verify tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'assets', 'documents', 'tax_calculations', 'compliance_alerts');
```

You should see all 5 tables.

---

## 🔄 Database Issues

### ❌ "RLS policy violation" / "Row-Level Security policy"

**Problem**: Your user doesn't have permission to access the data.

**Solutions**:
1. ✅ **FIXED!** Profile creation now happens server-side with service role key
2. Verify RLS policies exist by running this in SQL Editor:
   ```sql
   SELECT tablename, policyname 
   FROM pg_policies 
   WHERE schemaname = 'public'
   ORDER BY tablename;
   ```
3. If policies are missing, re-run `/supabase/setup.sql`

---

### ❌ "Table 'user_profiles' does not exist"

**Problem**: Database hasn't been set up.

**Solution**:
1. Go to Supabase dashboard
2. Open SQL Editor
3. Copy `/supabase/setup.sql` contents
4. Paste and run
5. Verify success (should say "Success. No rows returned")

---

### ❌ "Duplicate key value violates unique constraint"

**Problem**: Trying to create a record that already exists.

**This typically happens with**:
- Duplicate email in `user_profiles`
- Duplicate asset names (not enforced, so unlikely)

**Solutions**:
1. For user signup: Use a different email or sign in instead
2. For assets: This shouldn't happen, but if it does, use a different name
3. If you're a developer: Check for duplicate insert calls in your code

---

## 🌐 Network Issues

### ❌ "Failed to fetch" / Network error

**Problem**: Can't connect to Supabase backend.

**Solutions**:
1. Check your internet connection
2. Verify Supabase project is not paused (free tier auto-pauses after 1 week of inactivity)
3. Check if Supabase is down: https://status.supabase.com
4. Verify your Supabase URL in `/utils/supabase/info.tsx` is correct
5. Check browser console for CORS errors

---

### ❌ Edge Functions not working / 404 on API calls

**Problem**: Server edge functions aren't deployed or URL is wrong.

**Solutions**:
1. Deploy edge functions:
   ```bash
   supabase functions deploy server
   ```
2. Verify deployment:
   ```bash
   supabase functions list
   ```
3. Test the health endpoint:
   ```bash
   curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-b5fd51b8/health
   ```
4. Check function logs:
   ```bash
   supabase functions logs server
   ```

---

## 💾 Data Issues

### ❌ "No assets found" but I added some

**Problem**: Data not loading or filtered out.

**Solutions**:
1. Refresh the page (Cmd/Ctrl + R)
2. Check browser console for errors
3. Verify you're signed in as the correct user
4. Check RLS policies allow you to read your own data
5. Query directly in Supabase dashboard:
   ```sql
   SELECT * FROM assets WHERE user_id = 'YOUR_USER_ID';
   ```

---

### ❌ Tax calculations seem wrong

**Problem**: Tax calculator logic might have issues or you entered incorrect data.

**Solutions**:
1. Verify all inputs (income, tax paid, country)
2. Check the tax year is correct
3. Remember this is a simplified MVP calculator
4. DTA relief percentages are approximations
5. For real tax advice, consult a professional

---

## 🎨 UI/UX Issues

### ❌ Page is blank / white screen

**Problem**: JavaScript error or component crash.

**Solutions**:
1. Open browser console (F12) and check for errors
2. Hard refresh: Cmd/Ctrl + Shift + R
3. Clear browser cache
4. Try a different browser
5. Check if you're blocking JavaScript

---

### ❌ "Navigate is not defined" or routing errors

**Problem**: React Router issue or navigation in wrong context.

**Solutions**:
1. Make sure you're not calling `useNavigate()` outside of a component
2. Verify all routes are wrapped in `<BrowserRouter>`
3. Check for typos in route paths
4. Clear browser cache and refresh

---

### ❌ Animations not working / janky performance

**Problem**: Motion library issues or performance problems.

**Solutions**:
1. This is cosmetic - functionality should still work
2. Try disabling browser extensions
3. Check if your device supports hardware acceleration
4. Performance mode: Comment out Motion components if needed

---

## 🔧 Development Issues

### ❌ "Module not found" errors

**Problem**: Dependencies not installed or wrong import path.

**Solutions**:
1. Install dependencies:
   ```bash
   npm install
   ```
2. Check import paths are correct
3. For specific version imports (e.g., sonner), use:
   ```typescript
   import { toast } from "sonner@2.0.3";
   ```
4. Restart dev server:
   ```bash
   npm run dev
   ```

---

### ❌ TypeScript errors

**Problem**: Type mismatches or missing types.

**Solutions**:
1. Most TypeScript errors won't prevent the app from running
2. Check the specific error message
3. Verify types in `/utils/supabase/client.tsx`
4. Use `any` as a temporary workaround (not recommended for production)

---

### ❌ Build fails

**Problem**: Production build errors.

**Solutions**:
1. Check for unused imports (these can cause build failures)
2. Verify all environment variables are set
3. Run locally first:
   ```bash
   npm run build
   npm run preview
   ```
4. Check build logs for specific errors

---

## 🚀 Deployment Issues

### ❌ Vercel/Netlify deployment fails

**Problem**: Build or configuration errors.

**Solutions**:
1. Check environment variables are set in deployment platform
2. Verify build command: `npm run build`
3. Verify output directory: `dist`
4. Check deployment logs for specific errors
5. Test build locally first

---

### ❌ "CORS error" on production

**Problem**: Cross-origin request blocked.

**Solutions**:
1. Edge functions should have CORS headers configured
2. Verify in `/supabase/functions/server/index.tsx`:
   ```typescript
   app.use('*', cors());
   ```
3. Check Supabase dashboard → Edge Functions → Settings
4. Make sure you're using the correct Supabase URL

---

## 📊 Supabase Dashboard Tips

### Check Auth Users
1. Go to Authentication → Users
2. You should see your registered users
3. Click on a user to see metadata

### Check Database Tables
1. Go to Database → Tables
2. Click on a table to view data
3. Use SQL Editor for complex queries

### Check Edge Function Logs
1. Go to Edge Functions → server
2. Click "Logs" tab
3. Look for errors or warnings

### Check Storage (if using)
1. Go to Storage → Buckets
2. Check if `make-b5fd51b8-uploads` exists
3. Verify file permissions

---

## 🆘 Still Having Issues?

### Debugging Checklist

- [ ] Checked browser console for errors
- [ ] Verified Supabase credentials are correct
- [ ] Ran database setup script
- [ ] Deployed edge functions
- [ ] Tested with a different browser
- [ ] Checked Supabase project isn't paused
- [ ] Read error messages carefully
- [ ] Tried signing out and back in
- [ ] Refreshed the page
- [ ] Cleared browser cache

### Get Help

1. **Check the logs**: Browser console + Supabase function logs
2. **Read error messages**: They usually tell you exactly what's wrong
3. **Search the docs**: 
   - Supabase: https://supabase.com/docs
   - React Router: https://reactrouter.com
   - Motion: https://motion.dev
4. **GitHub Issues**: Open an issue at https://github.com/dju78/gace/issues

---

## 💡 Prevention Tips

### For Developers
1. Always handle errors gracefully
2. Add loading states to prevent double-clicks
3. Use rate limiting for API calls
4. Test edge cases (empty data, long names, etc.)
5. Log errors to console with context

### For Users
1. Don't click buttons multiple times
2. Wait for loading indicators to finish
3. Use strong, unique passwords
4. Don't share your credentials
5. Report bugs when you find them

---

**Last Updated**: 2024-11-30  
**Version**: 1.0.0

For the most recent fixes and updates, check the GitHub repository: https://github.com/dju78/gace
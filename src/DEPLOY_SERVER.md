# 🚀 Quick Server Deployment Guide

## TL;DR - Copy & Paste These Commands

```bash
# 1. Install Supabase CLI (if not already installed)
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Link your project
supabase link --project-ref faczbtutzsrcnlrahifb

# 4. Deploy the Edge Function
supabase functions deploy server

# 5. Verify deployment
curl https://faczbtutzsrcnlrahifb.supabase.co/functions/v1/make-server-b5fd51b8/health
```

## Expected Output

After running `supabase functions deploy server`, you should see:
```
Deploying function server...
Function deployed successfully!
Function URL: https://faczbtutzsrcnlrahifb.supabase.co/functions/v1/server
```

After running the curl command, you should see:
```json
{"status":"ok","timestamp":"2024-12-01T..."}
```

## What This Does

1. **Installs Supabase CLI** - Command-line tool to manage Supabase projects
2. **Logs you in** - Authenticates with your Supabase account
3. **Links the project** - Connects CLI to your GACE project
4. **Deploys the server** - Uploads and activates the Edge Function
5. **Verifies** - Confirms the server is running

## If You Get Errors

### "supabase: command not found"
Try with npx instead:
```bash
npx supabase login
npx supabase link --project-ref faczbtutzsrcnlrahifb
npx supabase functions deploy server
```

### "Not authenticated"
Make sure you're logged into the correct Supabase account:
```bash
supabase login
# This will open a browser window to authenticate
```

### "Function not found"
The function might not exist yet. Check the directory:
```bash
ls supabase/functions/
# Should show: server/
```

### "Permission denied"
You might not have access to this project. Check:
1. You're logged into the correct Supabase account
2. You have access to project `faczbtutzsrcnlrahifb`
3. Your access token is valid

## Alternative: Deploy via Dashboard

If CLI doesn't work, use the web dashboard:

1. **Go to:** https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/functions
2. **Click:** "Deploy new function" button
3. **Enter name:** `server`
4. **Upload files from:** `/supabase/functions/server/` directory
   - `index.tsx` (main file)
   - `kv_store.tsx` (helper file)
   - `admin-routes.tsx` (optional - if exists)
5. **Click:** "Deploy"
6. **Wait:** 30-60 seconds for deployment
7. **Test:** Visit the health endpoint

## After Deployment

✅ **Sign up will work** - No more 404 errors  
✅ **Login will work** - Authentication fully functional  
✅ **All features enabled** - Assets, documents, tax calculations  

## Test the App

After deployment, try signing up:
1. Go to: `/signup`
2. Fill out the form with test data
3. Click "Create Account"
4. Should redirect to onboarding → Success! 🎉

## Need Help?

Check these resources:
- [Supabase Functions Docs](https://supabase.com/docs/guides/functions)
- [CLI Installation Guide](https://supabase.com/docs/guides/cli)
- [Your Project Dashboard](https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb)

## Common Questions

**Q: Do I need to redeploy every time I change code?**  
A: Only if you change server code in `/supabase/functions/server/`. Frontend changes don't require redeployment.

**Q: How long does deployment take?**  
A: Usually 30-60 seconds. First deployment might take 1-2 minutes.

**Q: Can I see function logs?**  
A: Yes! Run: `supabase functions logs server` or check the dashboard.

**Q: What if deployment fails?**  
A: Check the error message. Common issues:
- Missing dependencies
- Syntax errors in code
- Invalid project reference

---

**🎯 Bottom Line:** Run those 5 commands and you're done. The 404 error will be history!

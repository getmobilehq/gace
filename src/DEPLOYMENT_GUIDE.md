# GACE - Deployment Guide

Complete guide for deploying the GACE platform to production.

## 📋 Pre-Deployment Checklist

### Required Items
- [ ] Supabase project created
- [ ] Database schema deployed (`setup.sql`)
- [ ] Edge functions deployed
- [ ] Environment variables configured
- [ ] DNS/domain configured (optional)
- [ ] SSL certificate (automatic with Vercel/Netlify)

## 🗄️ Database Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in:
   - **Name**: GACE Production (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users (e.g., London for UK)
4. Click "Create new project"
5. Wait for project to initialize (~2 minutes)

### Step 2: Note Your Credentials

From the Supabase dashboard, go to **Settings → API**:

```
Project URL: https://YOUR_PROJECT_ID.supabase.co
API Keys:
  - anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  - service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (keep secret!)
```

⚠️ **IMPORTANT**: Never commit the service_role key to git or expose it to the frontend!

### Step 3: Run Database Migration

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy the entire contents of `/supabase/setup.sql`
4. Paste into the editor
5. Click "Run"
6. Verify success - you should see: "Success. No rows returned"

### Step 4: Verify Tables Created

Run this verification query:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'assets', 'documents', 'tax_calculations', 'compliance_alerts')
ORDER BY table_name;
```

You should see all 5 tables listed.

### Step 5: Verify RLS Policies

```sql
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

You should see policies for all tables.

## ☁️ Deploy Edge Functions

### Install Supabase CLI

```bash
# Using npm
npm install -g supabase

# Or using Homebrew (Mac)
brew install supabase/tap/supabase
```

### Login and Link Project

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID
```

When prompted, enter your database password from Step 1.

### Deploy Server Function

```bash
# Deploy the server edge function
supabase functions deploy server

# Verify deployment
supabase functions list
```

Expected output:
```
DEPLOYED FUNCTIONS
  NAME    CREATED AT           VERSION  STATUS
  server  2025-11-30 12:34:56  1        ACTIVE
```

### Test Edge Function

```bash
curl https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-b5fd51b8/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-30T12:34:56.789Z"
}
```

## 🔧 Configure Application

### Update Supabase Credentials

Edit `/utils/supabase/info.tsx`:

```typescript
// Replace with your actual credentials
export const projectId = "YOUR_PROJECT_ID"; // e.g., "faczbtutzsrcnlrahifb"
export const publicAnonKey = "YOUR_ANON_KEY"; // The public/anon key from Step 2
```

⚠️ **DO NOT** put the service_role key in this file! It should only exist in Supabase environment variables.

### Build and Test Locally

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Test the production build locally
npm run preview
```

Open [http://localhost:4173](http://localhost:4173) and test:
- [ ] Sign up new user
- [ ] Sign in
- [ ] Complete onboarding
- [ ] Create an asset
- [ ] View dashboard

## 🚀 Deploy to Vercel (Recommended)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
# From your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? gace (or your preferred name)
# - Directory? ./ (just press enter)
# - Override settings? No
```

### Step 4: Configure Environment Variables

In the Vercel dashboard:

1. Go to your project → Settings → Environment Variables
2. Add these variables:

```
VITE_SUPABASE_URL = https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY = YOUR_ANON_KEY
```

### Step 5: Redeploy with Environment Variables

```bash
vercel --prod
```

### Step 6: Get Your Production URL

```bash
vercel domains ls
```

Your app is live at: `https://gace-xxx.vercel.app`

## 🌐 Deploy to Netlify (Alternative)

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```

### Step 3: Initialize Site

```bash
netlify init

# Follow the prompts:
# - Create & configure a new site? Yes
# - Team? Your team
# - Site name? gace-production
# - Build command? npm run build
# - Publish directory? dist
```

### Step 4: Set Environment Variables

```bash
netlify env:set VITE_SUPABASE_URL "https://YOUR_PROJECT_ID.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "YOUR_ANON_KEY"
```

### Step 5: Deploy

```bash
netlify deploy --prod
```

Your app is live at: `https://gace-production.netlify.app`

## 🎯 Custom Domain (Optional)

### For Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `gace.app`)
3. Update DNS records as instructed:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (~5-60 minutes)

### For Netlify

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records:
   ```
   Type: CNAME
   Name: www
   Value: YOUR-SITE.netlify.app
   ```
4. Enable HTTPS (automatic)

## 🔒 Security Checklist

- [ ] Service role key is NOT in frontend code
- [ ] RLS policies are enabled on all tables
- [ ] CORS is properly configured in edge functions
- [ ] Environment variables are set correctly
- [ ] HTTPS is enabled (automatic with Vercel/Netlify)
- [ ] Strong database password is used
- [ ] API keys are not committed to git

## 📊 Post-Deployment Testing

### Test Signup Flow
1. Go to your production URL
2. Click "Sign Up"
3. Create a new account
4. Verify email (if email confirmation is enabled)
5. Complete onboarding
6. Check database for new user_profile record

### Test Asset Creation
1. Sign in
2. Navigate to Asset Manager
3. Add a new asset
4. Verify it appears in the list
5. Edit the asset
6. Delete the asset

### Test Tax Calculator
1. Navigate to Tax Calculator
2. Enter tax year and income
3. Calculate tax
4. Verify results are reasonable

### Test Document Upload
1. Navigate to Documents
2. Upload a test file
3. Process with OCR
4. Verify status changes

## 📈 Monitoring

### Supabase Monitoring

Go to your Supabase dashboard:
- **Database** → View table sizes, connections
- **API** → View request logs
- **Edge Functions** → View function logs and performance
- **Auth** → View user signups and activity

### Application Monitoring

For production, consider adding:
- [Sentry](https://sentry.io) - Error tracking
- [LogRocket](https://logrocket.com) - Session replay
- [PostHog](https://posthog.com) - Product analytics
- [Vercel Analytics](https://vercel.com/analytics) - Performance monitoring

## 🔄 Updating the Application

### Deploy Updates

For Vercel:
```bash
git push origin main  # Auto-deploys if GitHub integration is set up
# OR
vercel --prod
```

For Netlify:
```bash
git push origin main  # Auto-deploys if GitHub integration is set up
# OR
netlify deploy --prod
```

### Database Migrations

For schema changes:
1. Write migration SQL in a new file (e.g., `migration_002.sql`)
2. Run in Supabase SQL Editor
3. Test thoroughly
4. Document in version control

## 🆘 Troubleshooting

### "Failed to fetch" errors
- Check that edge functions are deployed: `supabase functions list`
- Verify Supabase URL is correct in `/utils/supabase/info.tsx`
- Check CORS settings in edge function

### "Unauthorized" errors
- Verify anon key is correct
- Check RLS policies allow the operation
- Ensure user is signed in for protected routes

### Database connection errors
- Check Supabase project is not paused (free tier pauses after 1 week of inactivity)
- Verify database password is correct
- Check connection pooling limits

### Edge function errors
- View logs: `supabase functions logs server`
- Check environment variables are set
- Verify service role key is configured in Supabase

## ✅ Deployment Complete!

Your GACE platform is now live and ready for users! 🎉

Remember to:
- Monitor error logs regularly
- Backup your database
- Keep dependencies updated
- Test new features before deploying
- Document any configuration changes

---

**Need Help?**
- Check Supabase docs: https://supabase.com/docs
- Vercel docs: https://vercel.com/docs
- Netlify docs: https://docs.netlify.com

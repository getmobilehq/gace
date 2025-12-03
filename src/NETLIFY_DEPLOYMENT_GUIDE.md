# 🚀 GACE Netlify Deployment Guide

Complete step-by-step guide to deploy your GACE application on Netlify with Supabase backend.

---

## 📋 Prerequisites

Before you start, gather these values from your Supabase Dashboard:

### **From Supabase Dashboard → Settings → API**
https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/settings/api

You need:
1. ✅ **Project URL** (e.g., `https://faczbtutzsrcnlrahifb.supabase.co`)
2. ✅ **anon/public key** (starts with `eyJhbGci...`)
3. ✅ **service_role key** (starts with `eyJhbGci...` - **SECRET!**)

---

## 🎯 PART 1: Netlify Environment Variables Setup

### **Step 1: Open Netlify Dashboard**
1. Go to https://app.netlify.com
2. Click on your **GACE site**
3. Click **"Site configuration"** (left sidebar)
4. Click **"Environment variables"**

### **Step 2: Add Variables**

Click **"Add a variable"** and add these **TWO variables**:

#### ✅ **Variable 1: Supabase URL**
```
Key:   VITE_SUPABASE_URL
Value: https://faczbtutzsrcnlrahifb.supabase.co
```
- **Scopes:** ✅ Builds, ✅ Functions, ✅ Post-processing
- **Click:** "Create variable"

#### ✅ **Variable 2: Supabase Anon Key**
```
Key:   VITE_SUPABASE_ANON_KEY
Value: [Paste your anon key from Supabase]
```
- **Scopes:** ✅ Builds, ✅ Functions, ✅ Post-processing
- **Click:** "Create variable"

⚠️ **IMPORTANT:** DO NOT add `VITE_SUPABASE_SERVICE_ROLE_KEY` to Netlify! This is a server-side secret and should NEVER be exposed to the frontend.

### **Step 3: Verify Variables**

You should now see:
```
VITE_SUPABASE_URL            https://faczbtutzsrcnlrahifb.supabase.co
VITE_SUPABASE_ANON_KEY       eyJhbGci... (truncated)
```

---

## 🔧 PART 2: Supabase Edge Functions Setup

The backend Edge Functions run on Supabase (NOT Netlify). You need to set server-side secrets in Supabase.

### **Step 1: Open Supabase Dashboard**
1. Go to https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb
2. Click **"Settings"** (gear icon in sidebar)
3. Click **"Edge Functions"** or **"Secrets"**

### **Step 2: Add Secrets**

Add these **FOUR secrets** (if not already set):

#### ✅ **Secret 1: SUPABASE_URL**
```
Name:  SUPABASE_URL
Value: https://faczbtutzsrcnlrahifb.supabase.co
```

#### ✅ **Secret 2: SUPABASE_SERVICE_ROLE_KEY**
```
Name:  SUPABASE_SERVICE_ROLE_KEY
Value: [Paste your service_role key]
```
⚠️ **This is a SECRET!** Never expose this to the frontend.

#### ✅ **Secret 3: SUPABASE_ANON_KEY**
```
Name:  SUPABASE_ANON_KEY
Value: [Paste your anon key]
```

#### ✅ **Secret 4: SUPABASE_DB_URL**
```
Name:  SUPABASE_DB_URL
Value: [Your database connection string]
```

You can find the database URL in:
**Settings → Database → Connection String → URI**

---

## 🏗️ PART 3: Deploy to Netlify

### **Option A: Automatic Deployment (via GitHub)**

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add environment variable support"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to Netlify Dashboard
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select your GACE repository
   - **Build settings:**
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

3. **Netlify will automatically:**
   - Pull your code from GitHub
   - Install dependencies
   - Build your app
   - Deploy to a public URL
   - Auto-deploy on every Git push

### **Option B: Manual Deployment (via CLI)**

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Build your app:**
   ```bash
   npm run build
   ```

4. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

---

## ✅ PART 4: Verify Deployment

### **Step 1: Check Frontend**

1. Open your Netlify site URL (e.g., `https://gace-app.netlify.app`)
2. Open browser console (F12 → Console)
3. Check for any errors
4. Try the signup/login pages

### **Step 2: Check Backend (Edge Functions)**

Open browser console and run:

```javascript
// Test health check
fetch('https://faczbtutzsrcnlrahifb.supabase.co/functions/v1/server/make-server-b5fd51b8/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend Health:', d))
  .catch(e => console.error('❌ Backend Error:', e))

// Test environment variables
fetch('https://faczbtutzsrcnlrahifb.supabase.co/functions/v1/server/make-server-b5fd51b8/debug/env')
  .then(r => r.json())
  .then(d => console.log('✅ Backend Env:', d))
  .catch(e => console.error('❌ Backend Error:', e))
```

You should see:
```json
{
  "hasSupabaseUrl": true,
  "hasServiceRoleKey": true,
  "hasAnonKey": true,
  "hasDbUrl": true
}
```

### **Step 3: Test Full Flow**

1. ✅ Try creating a new account
2. ✅ Try logging in
3. ✅ Check if dashboard loads
4. ✅ Try adding an asset
5. ✅ Try the tax calculator

---

## 🔍 Troubleshooting

### **Issue: "Failed to fetch" or CORS errors**

**Solution:** Make sure your Supabase Edge Function has CORS enabled. Check `/supabase/functions/server/index.tsx`:

```typescript
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
```

### **Issue: "Environment variables not loading"**

**Solution:**
1. Clear Netlify build cache: Site Settings → Build & Deploy → Clear cache and retry deploy
2. Check variable names have `VITE_` prefix
3. Verify variables in Netlify dashboard
4. Trigger a new deploy: Deploys → Trigger deploy → Deploy site

### **Issue: "404 Not Found" on routes**

**Solution:** Add a `netlify.toml` file to handle SPA routing:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### **Issue: "Duplicate email" error**

**Solution:** Use the Quick Delete panel on the signup page, or run this in browser console:

```javascript
const email = "your@email.com";
fetch('https://faczbtutzsrcnlrahifb.supabase.co/functions/v1/server/make-server-b5fd51b8/admin/delete-user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGci...' // your anon key
  },
  body: JSON.stringify({ email })
})
.then(r => r.json())
.then(d => console.log('Deleted:', d));
```

---

## 🔐 Security Notes

### ✅ **Safe to Expose (Public)**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Anonymous/public key (has RLS restrictions)

### ❌ **NEVER EXPOSE (Secret)**
- `SUPABASE_SERVICE_ROLE_KEY` - Full database access, bypasses RLS
- `SUPABASE_DB_URL` - Direct database connection string

### 🛡️ **Best Practices**
1. ✅ Use environment variables (not hardcoded values)
2. ✅ Set different keys for dev/staging/production
3. ✅ Rotate keys if they're accidentally exposed
4. ✅ Use RLS (Row Level Security) policies in Supabase
5. ✅ Never commit `.env` files to Git

---

## 📚 Additional Resources

- **Netlify Docs:** https://docs.netlify.com/
- **Supabase Docs:** https://supabase.com/docs
- **Vite Env Vars:** https://vitejs.dev/guide/env-and-mode.html
- **GACE GitHub:** [Your repo URL]

---

## 🎉 You're Done!

Your GACE application is now deployed on Netlify with a Supabase backend!

**Production URL:** `https://your-site-name.netlify.app`
**Backend URL:** `https://faczbtutzsrcnlrahifb.supabase.co/functions/v1/server/make-server-b5fd51b8`

For support, check the browser console for detailed error logs.

# 🔐 GACE Environment Variables Reference

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  👤 USER BROWSER                                            │
│  https://your-gace-app.netlify.app                         │
│                                                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ Uses these variables:
                   │ • VITE_SUPABASE_URL
                   │ • VITE_SUPABASE_ANON_KEY
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  🌐 NETLIFY (Frontend Hosting)                              │
│  • Hosts React/Vite application                            │
│  • Serves static files                                     │
│  • Injects VITE_* env vars at build time                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                   │
                   │ API Calls to:
                   │ /functions/v1/server/make-server-b5fd51b8/*
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ⚡ SUPABASE EDGE FUNCTIONS (Backend)                       │
│  • Runs Deno/Hono web server                               │
│  • Handles auth, CRUD operations                           │
│  • Uses these secrets:                                     │
│    • SUPABASE_URL                                          │
│    • SUPABASE_SERVICE_ROLE_KEY (SECRET!)                   │
│    • SUPABASE_ANON_KEY                                     │
│    • SUPABASE_DB_URL                                       │
│                                                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ Queries database
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  🗄️  SUPABASE POSTGRES DATABASE                            │
│  • Stores users, assets, documents, etc.                   │
│  • Protected by RLS policies                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Where to Set Each Variable

### **FRONTEND (Netlify Dashboard)**

Set these in: **Netlify → Site → Site Configuration → Environment Variables**

| Variable | Value | Secret? | Required |
|----------|-------|---------|----------|
| `VITE_SUPABASE_URL` | `https://faczbtutzsrcnlrahifb.supabase.co` | ❌ No | ✅ Yes |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` (your anon key) | ❌ No | ✅ Yes |

**Why VITE_ prefix?**
- Vite only exposes environment variables starting with `VITE_` to the browser
- This prevents accidentally exposing secrets

---

### **BACKEND (Supabase Dashboard)**

Set these in: **Supabase → Settings → Edge Functions → Secrets**

| Variable | Value | Secret? | Required |
|----------|-------|---------|----------|
| `SUPABASE_URL` | `https://faczbtutzsrcnlrahifb.supabase.co` | ❌ No | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` (your service_role key) | ⚠️ **YES!** | ✅ Yes |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` (your anon key) | ❌ No | ✅ Yes |
| `SUPABASE_DB_URL` | `postgresql://...` (connection string) | ⚠️ **YES!** | ✅ Yes |

**⚠️ CRITICAL:** NEVER add `SUPABASE_SERVICE_ROLE_KEY` to Netlify! It has full database access.

---

## 📋 How to Get These Values

### **Step 1: Open Supabase Dashboard**
https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/settings/api

### **Step 2: Copy Values**

```
Project URL (for SUPABASE_URL & VITE_SUPABASE_URL):
┌─────────────────────────────────────────────────────┐
│ https://faczbtutzsrcnlrahifb.supabase.co           │
└─────────────────────────────────────────────────────┘

Project API Keys:
┌─────────────────────────────────────────────────────┐
│ anon/public   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV... │
│ (for VITE_SUPABASE_ANON_KEY & SUPABASE_ANON_KEY)   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ service_role  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV... │
│ (for SUPABASE_SERVICE_ROLE_KEY) ⚠️ SECRET!         │
└─────────────────────────────────────────────────────┘
```

### **Step 3: Get Database URL**
Go to: **Settings → Database → Connection String → URI**

```
postgresql://postgres:[YOUR-PASSWORD]@...supabase.co:5432/postgres
```

---

## 🔒 Security Guidelines

### ✅ **SAFE to expose (Public Keys)**

These can be in frontend code, visible in browser:

- ✅ `VITE_SUPABASE_URL` - Just your project URL
- ✅ `VITE_SUPABASE_ANON_KEY` - Limited by RLS policies

**Why it's safe:**
- Anon key can only access data allowed by Row Level Security (RLS) policies
- All sensitive operations require user authentication
- Database is protected by RLS policies

---

### ❌ **NEVER expose (Secret Keys)**

These must ONLY be on the server (Supabase Edge Functions):

- ❌ `SUPABASE_SERVICE_ROLE_KEY` - Bypasses ALL security
- ❌ `SUPABASE_DB_URL` - Direct database access

**If exposed:**
1. 🚨 Immediately rotate the keys in Supabase Dashboard
2. 🚨 Update all environment variables
3. 🚨 Redeploy your application

---

## 📁 Local Development

For local development, create a `.env.local` file:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Edit `.env.local`:
```bash
VITE_SUPABASE_URL=https://faczbtutzsrcnlrahifb.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important:**
- ✅ `.env.local` is in `.gitignore` (won't be committed)
- ✅ Only VITE_* variables are needed for frontend development
- ✅ Backend variables are only needed when running Edge Functions locally

---

## 🔍 How to Verify Variables Are Set

### **Check Frontend (Browser Console):**

```javascript
// Check if environment variables are loaded
console.log({
  url: import.meta.env.VITE_SUPABASE_URL,
  hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  mode: import.meta.env.MODE
});

// Expected output:
// {
//   url: "https://faczbtutzsrcnlrahifb.supabase.co",
//   hasKey: true,
//   mode: "production"
// }
```

### **Check Backend (API Call):**

```javascript
// Check if backend has all required secrets
fetch('https://faczbtutzsrcnlrahifb.supabase.co/functions/v1/server/make-server-b5fd51b8/debug/env')
  .then(r => r.json())
  .then(d => console.log('Backend env:', d));

// Expected output:
// {
//   hasSupabaseUrl: true,
//   hasServiceRoleKey: true,
//   hasAnonKey: true,
//   hasDbUrl: true,
//   supabaseUrlPreview: "https://faczbtutzsrcnlrahifb...",
//   denoVersion: "1.40.0"
// }
```

---

## 🛠️ Troubleshooting

### **Issue: "import.meta.env.VITE_SUPABASE_URL is undefined"**

**Cause:** Environment variable not set or missing `VITE_` prefix

**Solution:**
1. Check variable name has `VITE_` prefix
2. In Netlify: Clear cache and redeploy
3. In local dev: Restart dev server

---

### **Issue: "Failed to connect to database"**

**Cause:** Backend secrets not set in Supabase

**Solution:**
1. Go to Supabase Dashboard → Settings → Edge Functions → Secrets
2. Add all 4 required secrets (see table above)
3. Redeploy Edge Function

---

### **Issue: "CORS error" or "Network error"**

**Cause:** Edge Function not deployed or CORS not configured

**Solution:**
1. Check Edge Function is deployed in Supabase
2. Verify CORS settings in `/supabase/functions/server/index.tsx`
3. Check browser console for exact error

---

## 📚 References

- **Vite Env Variables:** https://vitejs.dev/guide/env-and-mode.html
- **Supabase Edge Functions:** https://supabase.com/docs/guides/functions
- **Netlify Environment Variables:** https://docs.netlify.com/environment-variables/overview/

---

## ✅ Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  NETLIFY (Frontend - 2 variables)                      │
│  ✅ VITE_SUPABASE_URL                                   │
│  ✅ VITE_SUPABASE_ANON_KEY                              │
│                                                         │
│  SUPABASE (Backend - 4 secrets)                        │
│  ✅ SUPABASE_URL                                        │
│  ✅ SUPABASE_SERVICE_ROLE_KEY ⚠️ SECRET!                │
│  ✅ SUPABASE_ANON_KEY                                   │
│  ✅ SUPABASE_DB_URL ⚠️ SECRET!                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Remember:** Frontend = VITE_* | Backend = NO VITE_*

---

**Need help?** Check the full deployment guide in `NETLIFY_DEPLOYMENT_GUIDE.md`

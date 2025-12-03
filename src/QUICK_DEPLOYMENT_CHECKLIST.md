# ⚡ GACE Quick Deployment Checklist

Use this quick reference when deploying to Netlify.

---

## ✅ Pre-Deployment Checklist

- [ ] Have Supabase Project URL
- [ ] Have Supabase Anon Key
- [ ] Have Supabase Service Role Key
- [ ] Code pushed to GitHub
- [ ] Netlify account created

---

## 🎯 Netlify Setup (2 Variables)

Go to: **Netlify Dashboard → Site → Site Configuration → Environment Variables**

### Add these variables:

```
Variable 1:
Key:   VITE_SUPABASE_URL
Value: https://faczbtutzsrcnlrahifb.supabase.co
Scopes: ✅ All

Variable 2:
Key:   VITE_SUPABASE_ANON_KEY
Value: [Your anon key from Supabase]
Scopes: ✅ All
```

⚠️ **DO NOT ADD** `VITE_SUPABASE_SERVICE_ROLE_KEY` to Netlify!

---

## 🔧 Supabase Setup (4 Secrets)

Go to: **Supabase Dashboard → Settings → Edge Functions → Secrets**

### Add these secrets:

```
Secret 1:
Name:  SUPABASE_URL
Value: https://faczbtutzsrcnlrahifb.supabase.co

Secret 2:
Name:  SUPABASE_SERVICE_ROLE_KEY
Value: [Your service_role key - SECRET!]

Secret 3:
Name:  SUPABASE_ANON_KEY
Value: [Your anon key]

Secret 4:
Name:  SUPABASE_DB_URL
Value: [Your database connection string]
```

---

## 🚀 Deploy

### Option 1: Auto-Deploy (Recommended)
1. Push to GitHub: `git push origin main`
2. Netlify auto-deploys!

### Option 2: Manual Deploy
```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod
```

---

## ✅ Verify Deployment

Open browser console (F12) and run:

```javascript
// Test frontend
console.log('Environment:', {
  url: import.meta.env.VITE_SUPABASE_URL,
  hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
});

// Test backend health
fetch('https://faczbtutzsrcnlrahifb.supabase.co/functions/v1/server/make-server-b5fd51b8/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend:', d));

// Test backend environment
fetch('https://faczbtutzsrcnlrahifb.supabase.co/functions/v1/server/make-server-b5fd51b8/debug/env')
  .then(r => r.json())
  .then(d => console.log('✅ Env Check:', d));
```

Expected output:
```json
{
  "hasSupabaseUrl": true,
  "hasServiceRoleKey": true,
  "hasAnonKey": true,
  "hasDbUrl": true
}
```

---

## 🎯 Quick Test

1. ✅ Open your Netlify site
2. ✅ Try signup with new email
3. ✅ Try login
4. ✅ Check dashboard loads
5. ✅ Try adding an asset

---

## 🐛 Common Issues

### Issue: Build fails
- Check Node version in `netlify.toml` (set to 18)
- Check build command: `npm run build`
- Check publish directory: `dist`

### Issue: 404 on routes
- Make sure `netlify.toml` exists with redirects
- Check "Publish directory" is set to `dist`

### Issue: API calls fail
- Check environment variables have `VITE_` prefix
- Clear build cache and redeploy
- Check CORS in Edge Function

### Issue: Duplicate email error
- Use Quick Delete panel on signup page
- Or delete via console (see full guide)

---

## 📖 Full Guide

For detailed instructions, see: **`NETLIFY_DEPLOYMENT_GUIDE.md`**

---

## 🎉 Done!

Your GACE app is now live on Netlify! 🚀

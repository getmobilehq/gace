# ⚡ CI/CD Quick Start - Deploy GACE in 10 Minutes

Complete CI/CD setup in 4 simple steps!

---

## 📋 What You'll Get

✅ Automated builds on every push
✅ Automated deployments to Netlify
✅ Deploy previews for pull requests
✅ Automated dependency updates
✅ Code quality checks (TypeScript, ESLint)
✅ Security audits

---

## 🚀 Step 1: Push CI/CD Files to GitHub (2 minutes)

```bash
# Stage all CI/CD configuration files
git add .github/ netlify.toml vite.config.ts tsconfig.json index.html main.tsx

# Commit
git commit -m "Add CI/CD pipeline with GitHub Actions and Netlify"

# Push to GitHub
git push origin main
```

**What this does:**
- Uploads GitHub Actions workflows
- Uploads Netlify configuration
- Uploads Vite build configuration

---

## 🔐 Step 2: Configure GitHub Secrets (3 minutes)

### **Go to GitHub:**
https://github.com/dju78/Gaceapp/settings/secrets/actions

### **Click "New repository secret" and add these:**

#### **Secret 1: VITE_SUPABASE_URL**
```
Name:  VITE_SUPABASE_URL
Value: https://faczbtutzsrcnlrahifb.supabase.co
```
Click "Add secret"

#### **Secret 2: VITE_SUPABASE_ANON_KEY**
```
Name:  VITE_SUPABASE_ANON_KEY
Value: [Paste your anon key from Supabase]
```
Click "Add secret"

**Get your anon key from:**
https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/settings/api

---

## 🌐 Step 3: Connect Netlify to GitHub (3 minutes)

### **A. Go to Netlify:**
https://app.netlify.com

### **B. Import Project:**
1. Click "Add new site" → "Import an existing project"
2. Click "Deploy with GitHub"
3. Authorize Netlify (if needed)
4. Select repository: **dju78/Gaceapp**

### **C. Configure Build:**
```
Build command:       npm run build
Publish directory:   dist
Branch to deploy:    main
```

### **D. Add Environment Variables:**
Click "Add environment variables" → "Add a single variable"

**Variable 1:**
```
Key:   VITE_SUPABASE_URL
Value: https://faczbtutzsrcnlrahifb.supabase.co
```

**Variable 2:**
```
Key:   VITE_SUPABASE_ANON_KEY
Value: [Your anon key from Supabase]
```

### **E. Deploy!**
Click "Deploy Gaceapp"

Netlify will now:
- ✅ Pull code from GitHub
- ✅ Install dependencies
- ✅ Build the app
- ✅ Deploy to production
- ✅ Give you a live URL!

---

## ✅ Step 4: Verify Everything Works (2 minutes)

### **A. Check GitHub Actions:**
Go to: https://github.com/dju78/Gaceapp/actions

You should see:
- ✅ **CI Pipeline** - Running or completed with green checkmarks
- ✅ All jobs passing

### **B. Check Netlify Deployment:**
Go to your Netlify site (you'll get the URL after Step 3)

You should see:
- ✅ Your GACE app is live!
- ✅ Login page loads
- ✅ No console errors

### **C. Test the App:**
1. Open your Netlify URL
2. Try signing up
3. Check the dashboard loads
4. ✅ Success!

---

## 🎨 Bonus: Update README Badge (1 minute)

### **Get Your Netlify Badge:**

1. Go to: Netlify → Site Settings → General → Status badges
2. Copy the Markdown code
3. Update your `README.md`:

```markdown
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_SITE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_SITE_NAME/deploys)
```

4. Commit and push:
```bash
git add README.md
git commit -m "Add Netlify status badge"
git push origin main
```

---

## 🔄 How It Works Now

### **Every time you push code:**

```
git push origin main
    ↓
GitHub Actions runs CI:
    ✅ Type checking
    ✅ Linting
    ✅ Building
    ✅ Security audit
    ↓
Netlify deploys:
    ✅ Pull code
    ✅ Build app
    ✅ Deploy to production
    ↓
Your site is live! 🎉
```

### **Every time you create a PR:**

```
Create Pull Request
    ↓
GitHub Actions runs CI:
    ✅ All quality checks
    ↓
Netlify creates preview:
    ✅ Deploy preview URL
    ✅ Comment on PR
    ↓
Review code + preview
    ↓
Merge PR
    ↓
Auto-deploy to production! 🚀
```

---

## 🧪 Test Your CI/CD Pipeline

### **Test 1: Push a Change**

```bash
# Make a small change
echo "# CI/CD is working!" >> CICD_TEST.md

# Commit and push
git add CICD_TEST.md
git commit -m "Test CI/CD pipeline"
git push origin main
```

**Watch what happens:**
1. Go to: https://github.com/dju78/Gaceapp/actions
2. See CI pipeline run automatically ✅
3. Go to Netlify dashboard
4. See new deployment in progress ✅
5. Site updates within 2-3 minutes ✅

---

### **Test 2: Create a Pull Request**

```bash
# Create feature branch
git checkout -b feature/test-cicd

# Make a change
echo "Testing PR workflow" >> PR_TEST.md
git add PR_TEST.md
git commit -m "Test PR workflow"
git push origin feature/test-cicd
```

**On GitHub:**
1. Create PR: `feature/test-cicd` → `main`
2. Watch CI run checks ✅
3. See Netlify deploy preview URL ✅
4. PR gets auto-labeled ✅
5. Merge PR → auto-deploys to production ✅

---

## 📊 What Got Installed

### **GitHub Actions Workflows:**
- `.github/workflows/ci.yml` - Build, test, lint, security audit
- `.github/workflows/deploy.yml` - Deploy to Netlify (optional)
- `.github/workflows/pr-labeler.yml` - Auto-label PRs

### **GitHub Configuration:**
- `.github/dependabot.yml` - Automated dependency updates
- `.github/labeler.yml` - Label configuration
- `.github/PULL_REQUEST_TEMPLATE.md` - PR template

### **Build Configuration:**
- `vite.config.ts` - Vite build settings
- `tsconfig.json` - TypeScript configuration
- `netlify.toml` - Netlify deployment settings

---

## 🐛 Troubleshooting

### **GitHub Actions not running?**
1. Check: https://github.com/dju78/Gaceapp/actions
2. Enable workflows if disabled
3. Check secrets are set

### **Netlify build failing?**
1. Check Netlify deploy logs
2. Verify environment variables are set
3. Test build locally: `npm run build`
4. Check `dist/` folder is created

### **Site not updating?**
1. Check Netlify deployment status
2. Clear browser cache (Ctrl+F5)
3. Check if build succeeded
4. Verify correct branch is deployed (main)

---

## 📚 Full Documentation

For detailed guides, see:
- **`CI_CD_SETUP_GUIDE.md`** - Complete setup guide
- **`NETLIFY_DEPLOYMENT_GUIDE.md`** - Netlify-specific guide
- **`ENVIRONMENT_VARIABLES.md`** - Environment variables explained

---

## ✅ Success Checklist

- [ ] Pushed CI/CD files to GitHub
- [ ] GitHub secrets configured
- [ ] Netlify connected to GitHub
- [ ] Netlify environment variables set
- [ ] First deployment successful
- [ ] CI pipeline passing (green checkmarks)
- [ ] Site is live and accessible
- [ ] Tested push to main (auto-deploys)
- [ ] Tested PR creation (deploy preview)

---

## 🎉 You're Done!

Your GACE application now has a complete CI/CD pipeline!

**Live Site:** `https://your-site-name.netlify.app`
**GitHub Actions:** https://github.com/dju78/Gaceapp/actions
**Netlify Dashboard:** https://app.netlify.com

Every code change is now automatically tested, built, and deployed! 🚀

---

**Questions?** Check the full guide in `CI_CD_SETUP_GUIDE.md`

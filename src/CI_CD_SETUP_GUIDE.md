# 🚀 CI/CD Setup Guide for GACE

Complete guide to set up Continuous Integration and Continuous Deployment for your GACE application on Netlify with GitHub Actions.

---

## 📋 Overview

Your CI/CD pipeline includes:

✅ **Continuous Integration (CI)** - GitHub Actions
- ✅ Automated builds on every push
- ✅ TypeScript type checking
- ✅ Code linting with ESLint
- ✅ Security audits
- ✅ Multi-version Node.js testing (18.x, 20.x)

✅ **Continuous Deployment (CD)** - Netlify
- ✅ Auto-deploy on push to `main` branch
- ✅ Deploy previews for pull requests
- ✅ Rollback support
- ✅ Environment variable management

✅ **Automated Maintenance**
- ✅ Dependabot for dependency updates
- ✅ Automated PR labeling
- ✅ Pull request templates

---

## 🎯 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  👨‍💻 Developer                                               │
│  git push origin main                                       │
│                                                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  🐙 GitHub Repository                                       │
│  https://github.com/dju78/Gaceapp                          │
│                                                             │
└──────────┬───────────────────────────────┬──────────────────┘
           │                               │
           │                               │
           ▼                               ▼
┌──────────────────────┐       ┌──────────────────────────────┐
│                      │       │                              │
│  🔄 GitHub Actions   │       │  🌐 Netlify                  │
│  (CI Pipeline)       │       │  (CD Pipeline)               │
│                      │       │                              │
│  ✅ Build & Test     │       │  ✅ Auto-deploy              │
│  ✅ Type Check       │       │  ✅ Deploy Previews          │
│  ✅ Lint Code        │       │  ✅ Production Deploy        │
│  ✅ Security Audit   │       │                              │
│                      │       │                              │
└──────────────────────┘       └──────────┬───────────────────┘
                                          │
                                          ▼
                               ┌──────────────────────────────┐
                               │                              │
                               │  🌍 Live Site                │
                               │  https://your-site.netlify.app│
                               │                              │
                               └──────────────────────────────┘
```

---

## 🔧 Part 1: GitHub Repository Setup

### **Step 1: Add GitHub Secrets**

Your GitHub Actions workflows need access to secrets. Add these in:

**GitHub → Gaceapp Repository → Settings → Secrets and variables → Actions → New repository secret**

#### **Required Secrets:**

```
Secret 1:
Name:  VITE_SUPABASE_URL
Value: https://faczbtutzsrcnlrahifb.supabase.co

Secret 2:
Name:  VITE_SUPABASE_ANON_KEY
Value: [Your anon key from Supabase]

Secret 3 (Optional - for GitHub Actions deploy):
Name:  NETLIFY_AUTH_TOKEN
Value: [Your Netlify personal access token]

Secret 4 (Optional - for GitHub Actions deploy):
Name:  NETLIFY_SITE_ID
Value: [Your Netlify site ID]
```

#### **How to Get Netlify Tokens (Optional):**

1. **NETLIFY_AUTH_TOKEN:**
   - Go to: https://app.netlify.com/user/applications
   - Click "New access token"
   - Name it "GitHub Actions"
   - Copy the token

2. **NETLIFY_SITE_ID:**
   - Go to your site in Netlify
   - Site settings → General → Site details → API ID
   - Copy the Site ID

---

### **Step 2: Enable GitHub Actions**

1. Go to: https://github.com/dju78/Gaceapp/actions
2. If disabled, click "I understand my workflows, go ahead and enable them"
3. Workflows will now run on every push!

---

### **Step 3: Enable Dependabot**

1. Go to: https://github.com/dju78/Gaceapp/settings/security_analysis
2. Enable "Dependabot alerts"
3. Enable "Dependabot security updates"
4. Dependabot will now create PRs for dependency updates every Monday!

---

## 🌐 Part 2: Netlify Setup

### **Option A: Automatic Netlify Deploy (Recommended)**

This uses Netlify's built-in GitHub integration (no GitHub Actions needed for deployment):

#### **Step 1: Connect GitHub to Netlify**

1. Go to: https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose "Deploy with GitHub"
4. Authorize Netlify to access your GitHub
5. Select repository: **dju78/Gaceapp**

#### **Step 2: Configure Build Settings**

```
Build command:       npm run build
Publish directory:   dist
Branch to deploy:    main
```

#### **Step 3: Set Environment Variables in Netlify**

**Netlify → Site → Site Configuration → Environment variables**

```
Key:   VITE_SUPABASE_URL
Value: https://faczbtutzsrcnlrahifb.supabase.co
Scopes: ✅ All

Key:   VITE_SUPABASE_ANON_KEY
Value: [Your anon key]
Scopes: ✅ All
```

#### **Step 4: Deploy!**

Click "Deploy site" - Netlify will:
- ✅ Pull code from GitHub
- ✅ Install dependencies
- ✅ Build the app
- ✅ Deploy to production
- ✅ Auto-deploy on every push to `main`

---

### **Option B: GitHub Actions Deploy (Advanced)**

This uses GitHub Actions to deploy to Netlify (more control):

**Prerequisites:** Add `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` to GitHub Secrets (see Part 1)

The `.github/workflows/deploy.yml` file is already configured!

Every push to `main` will:
1. Run CI checks (build, type check, lint)
2. Deploy to Netlify via GitHub Actions
3. Comment deployment status on commits

---

## 📊 Part 3: Verify CI/CD Pipeline

### **Step 1: Commit and Push the CI/CD Files**

```bash
# Stage all new CI/CD files
git add .github/

# Commit
git commit -m "Add CI/CD pipeline with GitHub Actions and Netlify"

# Push to GitHub
git push origin main
```

### **Step 2: Watch GitHub Actions**

1. Go to: https://github.com/dju78/Gaceapp/actions
2. You should see workflows running:
   - ✅ **CI Pipeline** - Build, test, lint
   - ✅ **Deploy to Netlify** (if using Option B)
   - ✅ **PR Labeler** (on PRs)

### **Step 3: Check Netlify Deployment**

1. Go to: https://app.netlify.com/sites/YOUR_SITE_NAME/deploys
2. You should see the deployment in progress or completed
3. Click "Open production deploy" to view your live site!

---

## ✅ Part 4: Test the Pipeline

### **Test 1: Push a Change**

```bash
# Make a small change
echo "# Test CI/CD" >> TEST.md

# Commit and push
git add TEST.md
git commit -m "Test CI/CD pipeline"
git push origin main
```

**Expected behavior:**
1. GitHub Actions CI runs automatically
2. Netlify builds and deploys automatically
3. New version goes live within 2-3 minutes

---

### **Test 2: Create a Pull Request**

```bash
# Create a new branch
git checkout -b feature/test-pr

# Make a change
echo "Test PR" >> TEST.md
git add TEST.md
git commit -m "Test PR workflow"
git push origin feature/test-pr
```

**Then on GitHub:**
1. Create a pull request from `feature/test-pr` to `main`
2. Watch GitHub Actions run CI checks
3. Netlify creates a deploy preview
4. PR gets auto-labeled based on changed files
5. You see deployment preview URL in PR comments

---

## 🎨 Part 5: Update README Badges

Once deployed, update the badges in README.md:

```markdown
[![CI Pipeline](https://github.com/dju78/Gaceapp/actions/workflows/ci.yml/badge.svg)](https://github.com/dju78/Gaceapp/actions/workflows/ci.yml)
[![Deploy to Netlify](https://github.com/dju78/Gaceapp/actions/workflows/deploy.yml/badge.svg)](https://github.com/dju78/Gaceapp/actions/workflows/deploy.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_NETLIFY_SITE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_NETLIFY_SITE_NAME/deploys)
```

**To get your Netlify badge:**
1. Go to: Netlify → Site Settings → General → Status badges
2. Copy the Markdown badge code
3. Replace `YOUR_NETLIFY_SITE_ID` and `YOUR_NETLIFY_SITE_NAME`

---

## 📋 Workflow Files Explained

### **`.github/workflows/ci.yml`**
Runs on every push and PR:
- ✅ Builds on Node 18 and 20
- ✅ TypeScript type checking
- ✅ ESLint code linting
- ✅ npm security audit
- ✅ Uploads build artifacts

### **`.github/workflows/deploy.yml`**
Runs on push to `main`:
- ✅ Builds the application
- ✅ Deploys to Netlify
- ✅ Posts deployment status

### **`.github/workflows/pr-labeler.yml`**
Runs on PRs:
- ✅ Auto-labels based on changed files
- ✅ Labels PR size (xs/s/m/l/xl)
- ✅ Warns on very large PRs

### **`.github/dependabot.yml`**
Runs weekly (Mondays 9am):
- ✅ Checks for npm dependency updates
- ✅ Checks for GitHub Actions updates
- ✅ Creates PRs for updates
- ✅ Groups minor/patch updates

---

## 🔍 Monitoring and Maintenance

### **GitHub Actions Logs**
- View all workflow runs: https://github.com/dju78/Gaceapp/actions
- Click any workflow to see detailed logs
- Debug failed builds

### **Netlify Deploy Logs**
- View all deploys: https://app.netlify.com/sites/YOUR_SITE_NAME/deploys
- Click any deploy to see build logs
- Rollback to previous deploys

### **Dependabot PRs**
- Automatically created every Monday
- Review and merge dependency updates
- Keeps your app secure and up-to-date

---

## 🐛 Troubleshooting

### **Issue: GitHub Actions Failing**

**Cause:** Missing secrets or build errors

**Solution:**
1. Check workflow logs: https://github.com/dju78/Gaceapp/actions
2. Verify secrets are set: Settings → Secrets and variables → Actions
3. Check build locally: `npm run build`
4. Fix errors and push again

---

### **Issue: Netlify Deploy Failing**

**Cause:** Build errors or missing environment variables

**Solution:**
1. Check Netlify deploy logs
2. Verify environment variables in Netlify dashboard
3. Test build locally: `npm run build` and check `dist/` exists
4. Clear Netlify cache and redeploy

---

### **Issue: Deploy Preview Not Created**

**Cause:** Netlify GitHub app not connected

**Solution:**
1. Go to Netlify → Site Settings → Build & deploy → Deploy notifications
2. Enable "GitHub commit statuses"
3. Enable "GitHub PR comments"
4. Reconnect GitHub app if needed

---

### **Issue: Dependabot PRs Not Created**

**Cause:** Dependabot not enabled

**Solution:**
1. Enable in GitHub: Settings → Security → Dependabot
2. Check `.github/dependabot.yml` exists
3. Wait until next Monday 9am for weekly run
4. Or trigger manually: Settings → Dependabot → Check for updates

---

## 📚 Best Practices

### **Branch Protection Rules**

Protect your `main` branch:

1. Go to: Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators

### **Deployment Strategy**

```
feature/xyz → PR → CI checks → Review → Merge → Deploy to production
```

1. Create feature branch
2. Make changes
3. Push and create PR
4. CI runs automatically
5. Netlify creates deploy preview
6. Review code and preview
7. Merge to main
8. Auto-deploy to production

### **Environment Management**

```
Development:  Local (npm run dev)
Preview:      Netlify deploy previews (PRs)
Production:   Netlify main branch deploys
```

---

## 🎉 Success Checklist

- [ ] GitHub repository: https://github.com/dju78/Gaceapp
- [ ] GitHub secrets configured (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [ ] GitHub Actions enabled
- [ ] Dependabot enabled
- [ ] Netlify site connected to GitHub
- [ ] Netlify environment variables set
- [ ] First deployment successful
- [ ] CI pipeline passing
- [ ] README badges updated
- [ ] Branch protection rules configured (optional)
- [ ] Deploy previews working on PRs

---

## 🚀 Next Steps

1. ✅ **Commit CI/CD files:** `git push origin main`
2. ✅ **Connect Netlify to GitHub**
3. ✅ **Configure environment variables**
4. ✅ **Watch first deployment**
5. ✅ **Test by creating a PR**
6. ✅ **Update README badges**

---

## 📞 Support

**GitHub Actions Docs:** https://docs.github.com/en/actions
**Netlify Docs:** https://docs.netlify.com/
**Dependabot Docs:** https://docs.github.com/en/code-security/dependabot

---

**Your GACE application now has a complete CI/CD pipeline!** 🎉

Every code change is automatically:
- ✅ Tested and validated
- ✅ Built and deployed
- ✅ Monitored and logged
- ✅ Kept secure and up-to-date

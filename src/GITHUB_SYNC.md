# Syncing with GitHub Repository

Guide for keeping your GitHub repository (https://github.com/dju78/gace.git) in sync with your local development.

## 🔄 Initial Setup

### If you haven't pushed to GitHub yet:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: GACE RegTech platform MVP"

# Add your GitHub repository as remote
git remote add origin https://github.com/dju78/gace.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### If the repository already exists:

```bash
# Clone the repository
git clone https://github.com/dju78/gace.git
cd gace

# Install dependencies
npm install
```

## 📝 .gitignore Configuration

Make sure you have a proper `.gitignore` file to avoid committing sensitive data:

```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
.output/
.vercel/
.netlify/

# Environment variables
.env
.env.local
.env.*.local
.env.production

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS files
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Temporary files
tmp/
temp/
*.tmp

# Supabase local development
.supabase/

# Don't commit sensitive credentials
# (These should be in info.tsx for now, but ideally move to .env)
# utils/supabase/info.tsx  # Uncomment if you move credentials to .env
```

## 🔐 Important: Protect Sensitive Data

### Current Setup
Right now, your Supabase credentials are in `/utils/supabase/info.tsx`. This file IS committed to git.

⚠️ **For production**, you should:

1. **Move credentials to environment variables:**

Create `.env`:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

2. **Update info.tsx to read from env:**
```typescript
export const projectId = import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] || "";
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
```

3. **Add .env to .gitignore**

4. **Create .env.example for reference:**
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🚀 Regular Workflow

### 1. Before Starting Work

```bash
# Get latest changes from GitHub
git pull origin main
```

### 2. Make Changes

Edit your files, add features, fix bugs...

### 3. Check What Changed

```bash
# See what files changed
git status

# See the actual changes
git diff
```

### 4. Stage Changes

```bash
# Add specific files
git add path/to/file.tsx

# Or add all changed files
git add .
```

### 5. Commit Changes

```bash
# Commit with a descriptive message
git commit -m "Fix: Resolve RLS policy error for user signup"

# Or for multiple changes
git commit -m "
feat: Add duplicate email validation
fix: Handle orphaned auth users
docs: Update deployment guide
"
```

### 6. Push to GitHub

```bash
# Push to main branch
git push origin main
```

## 📌 Branch Strategy

For better organization, use feature branches:

```bash
# Create a new branch for a feature
git checkout -b feature/tax-calculator-improvements

# Make your changes, commit them
git add .
git commit -m "Improve tax calculator DTA logic"

# Push the branch
git push origin feature/tax-calculator-improvements

# Create a Pull Request on GitHub
# After review and approval, merge to main
```

## 🔖 Git Commit Best Practices

### Commit Message Format

```
<type>: <short description>

<optional detailed description>
```

### Types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Formatting, missing semi-colons, etc.
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Examples:

```bash
git commit -m "feat: Add multi-currency support to asset manager"
git commit -m "fix: Resolve RLS policy error during signup"
git commit -m "docs: Update README with deployment instructions"
git commit -m "refactor: Extract tax calculation logic to separate service"
git commit -m "style: Format code with Prettier"
git commit -m "chore: Update dependencies to latest versions"
```

## 🏷️ Tagging Releases

When you reach milestones:

```bash
# Create a tag for MVP v1.0
git tag -a v1.0.0 -m "MVP Release - Innovator Founder Demo"

# Push the tag to GitHub
git push origin v1.0.0

# List all tags
git tag
```

## 🔄 Sync Changes from Figma Make to GitHub

If you're developing in Figma Make and want to sync to GitHub:

### Option 1: Manual Sync
1. Copy changed files from Figma Make
2. Paste into your local repository
3. Commit and push as usual

### Option 2: Export All Files
1. Download all files from Figma Make
2. Replace files in local repository
3. Review changes with `git diff`
4. Commit and push

## 📊 GitHub Actions (Optional)

For CI/CD, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

Then add secrets in GitHub: Settings → Secrets and variables → Actions

## 📦 Creating Releases on GitHub

1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Choose a tag (e.g., `v1.0.0`)
4. Add release notes:

```markdown
## GACE v1.0.0 - MVP Release

### Features
- ✅ Multi-role authentication system
- ✅ Asset management with CRUD operations
- ✅ UK tax calculator with DTA relief
- ✅ Document upload with OCR processing
- ✅ Real-time compliance alerts

### Technical
- PostgreSQL database with RLS
- 15+ RESTful API endpoints
- Motion animations
- Responsive design

### Bug Fixes
- Fixed RLS policy violation on signup
- Fixed duplicate email handling
- Improved error messages

### Known Issues
- None for MVP scope

### Demo
Demo site: https://gace.vercel.app
```

4. Click "Publish release"

## 🔍 Useful Git Commands

```bash
# View commit history
git log --oneline --graph --all

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Create a branch from a previous commit
git checkout -b hotfix/critical-bug abc1234

# Stash changes temporarily
git stash
git stash pop

# View remote repository info
git remote -v

# Update remote URL
git remote set-url origin https://github.com/dju78/gace.git

# Clean untracked files
git clean -fd
```

## 📝 GitHub Repository Best Practices

### README Badges
Add status badges to your README:

```markdown
![Build Status](https://github.com/dju78/gace/workflows/Deploy/badge.svg)
![License](https://img.shields.io/badge/license-Private-red)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
```

### Issues
Use GitHub Issues to track:
- Bugs
- Feature requests
- MVP requirements
- Endorsement feedback

### Projects
Create a GitHub Project board:
- To Do
- In Progress
- In Review
- Done

### Wiki (Optional)
Document:
- Architecture decisions
- API documentation
- User guides
- Development setup

## ✅ Quick Reference

```bash
# Daily workflow
git pull origin main       # Get updates
# ... make changes ...
git add .                  # Stage changes
git commit -m "message"    # Commit
git push origin main       # Push to GitHub

# Branch workflow
git checkout -b feature/new-feature  # Create branch
# ... make changes ...
git commit -m "message"              # Commit
git push origin feature/new-feature  # Push branch
# Create PR on GitHub, merge after review

# Emergency hotfix
git checkout main                    # Switch to main
git checkout -b hotfix/critical-bug  # Create hotfix branch
# ... fix bug ...
git commit -m "fix: critical bug"    # Commit
git push origin hotfix/critical-bug  # Push
# Create PR, expedite review, merge
```

## 🎯 Your Next Steps

1. ✅ Ensure all latest code is committed to GitHub
2. ✅ Add proper .gitignore file
3. ✅ Update README with screenshots and demo link
4. ✅ Create v1.0.0 release tag for MVP
5. ✅ Set up GitHub Actions for auto-deployment (optional)
6. ✅ Document known issues in GitHub Issues

Your repository is ready for Innovator Founder endorsement presentations! 🚀

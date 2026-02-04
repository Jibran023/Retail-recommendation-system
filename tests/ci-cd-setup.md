# CI/CD Pipeline Setup Guide

## Overview
The GitHub Actions CI/CD pipeline automates testing, building, and deployment of the Retail Recommendation System.

## Pipeline Workflow

```
Push/PR → Tests → Build → Deploy
         ↓
      Lint & Type Check (parallel)
```

### Jobs

1. **test** - Runs Playwright E2E tests (36 tests)
2. **build** - Builds the application with Vite
3. **deploy** - Deploys to Vercel (Production on main, Preview on Development)
4. **lint** - TypeScript and linting checks

---

## Setup Instructions

### Step 1: Get Vercel Credentials

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to **Settings** → **Tokens**
3. Create a new token with the name "GitHub Actions"
4. Copy the token (you'll need it for GitHub secrets)


5. Go to your project in Vercel
6. Go to **Settings** → **General**
7. Copy **Project ID**
8. Copy your **Organization ID** from account settings

### Step 2: Add GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add the following secrets:

#### Required Secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VERCEL_TOKEN` | Your Vercel authentication token | `xxxxxxxxxxxxx` |
| `VERCEL_ORG_ID` | Your Vercel organization/team ID | `team_xxxxxxxxxxxx` |
| `VERCEL_PROJECT_ID` | Your Vercel project ID | `prj_xxxxxxxxxxxx` |
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `xxxxxxxxxxxxx` |

#### How to Add Secrets:

1. Click **New repository secret**
2. Enter the name (e.g., `VERCEL_TOKEN`)
3. Paste the value
4. Click **Add secret**

Repeat for all secrets.

### Step 3: Configure Vercel (Optional)

If you want Vercel to auto-deploy on push (which it does by default when connected to GitHub), you can skip this. However, the GitHub Actions workflow gives you more control:

- Tests must pass before deployment
- Custom deployment logic
- Parallel jobs for faster feedback
- PR comments with deployment URLs

### Step 4: Push to GitHub

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions CI/CD pipeline"
git push origin Development
```

### Step 5: Verify Pipeline

1. Go to your GitHub repository
2. Click on the **Actions** tab
3. You should see your workflow running
4. Click on the run to see detailed logs

---

## Pipeline Features

### ✅ Automated Testing
- Runs all 36 Playwright E2E tests on every push/PR
- Uploads test reports and screenshots
- Comments on PRs with test results

### ✅ Build Verification
- Ensures the application builds successfully
- Checks build size
- Uploads build artifacts

### ✅ Automated Deployment
- **main branch** → Production deployment (Vercel)
- **Development branch** → Preview deployment
- Only deploys if tests and build pass

### ✅ Type Checking
- Runs TypeScript compiler checks
- Catches type errors before deployment
- Comments on PRs if issues found

### ✅ Concurrency Control
- Cancels old runs when new commits are pushed
- Saves resources and time

---

## Workflow Triggers

The pipeline runs on:

- **Push** to `main` or `Development` branches
- **Pull Requests** to `main` or `Development` branches
- **Manual** trigger via Actions tab (workflow_dispatch)

---

## Troubleshooting

### Issue: "VERCEL_TOKEN not found"
**Solution**: Add the `VERCEL_TOKEN` secret in GitHub repository settings

### Issue: "Build failed"
**Solution**: Check the build logs in Actions tab. Common issues:
- Missing environment variables
- TypeScript errors
- Missing dependencies

### Issue: "Tests failed"
**Solution**:
1. Download test artifacts from the failed run
2. Run tests locally: `npm test`
3. Check screenshots in `test-results/` folder

### Issue: "Deployment failed"
**Solution**:
1. Check Vercel deployment logs
2. Verify Vercel credentials are correct
3. Ensure Vercel project is connected to GitHub

---

## Pipeline Status Badge

Add this to your README.md to show pipeline status:

```markdown
![CI/CD Pipeline](https://github.com/Jibran023/Retail-recommendation-system/actions/workflows/ci.yml/badge.svg)
```

---

## Environment-Specific Deployments

### Production (main branch)
- URL: Your production Vercel URL
- Triggered on: Push to `main`
- Requirements: All tests pass, build succeeds

### Preview (Development branch)
- URL: Preview URL (e.g., `https://your-app-git-development.vercel.app`)
- Triggered on: Push to `Development`
- Requirements: All tests pass, build succeeds

---

## Performance

| Job | Average Duration |
|-----|------------------|
| Test | 2-3 minutes |
| Build | 1-2 minutes |
| Deploy | 1-2 minutes |
| Lint | 30-60 seconds |

**Total**: ~5-7 minutes (jobs run in parallel where possible)

---

## Next Steps

1. ✅ Add GitHub secrets (see Step 2)
2. ✅ Push the workflow file to GitHub
3. ✅ Verify the pipeline runs successfully
4. ✅ Check deployments on Vercel
5. ✅ Enable branch protection rules (optional, see below)

---

## Optional: Branch Protection Rules

To enforce quality checks, enable branch protection:

1. Go to **Settings** → **Branches**
2. Click **Add rule**
3. Enter branch name pattern: `main`
4. Enable:
   - ✅ **Require status checks to pass before merging**
   - ✅ **Require branches to be up to date before merging**
   - Select required checks:
     - `Run E2E Tests`
     - `Build Application`
     - `Lint & Type Check`
5. Click **Create**

This ensures that the main branch only receives commits that pass all tests and builds.

---

## Summary

The CI/CD pipeline provides:
- 🚀 **Automated testing** on every commit
- 🏗️ **Build verification** before deployment
- 🌐 **Automated deployment** to Vercel
- 🔍 **Type checking** and linting
- 📊 **PR comments** with test results and deployment URLs
- ⚡ **Fast feedback** with parallel job execution

Your application is now production-ready with professional-grade CI/CD!

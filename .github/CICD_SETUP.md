# CI/CD Setup Guide

This document explains how to set up and use the GitHub Actions CI/CD pipeline for the Construction Bid Builder project.

## 🚀 Overview

The CI/CD pipeline includes:

- **Continuous Integration**: Automated testing, linting, and building
- **Security Scanning**: Vulnerability checks and dependency audits
- **Code Quality**: Formatting and unused dependency checks
- **Automated Deployment**: Preview deployments for PRs, production deployments for main branch
- **Release Management**: Automatic versioning and release creation

## 📋 Workflows

### 1. CI Pipeline (`.github/workflows/ci.yml`)

Runs on every push and pull request to `main` and `develop` branches.

**Jobs:**

- **Test**: Runs on Node.js 18.x and 20.x
  - ESLint checking
  - TypeScript type checking
  - Build verification
  - Test execution (when available)
- **Security**: Security audit and vulnerability scanning
- **Code Quality**: Prettier formatting and dependency checks
- **Deploy Preview**: Creates preview deployments for pull requests

### 2. Production Deployment (`.github/workflows/deploy.yml`)

Runs on pushes to `main` branch and can be triggered manually.

**Jobs:**

- **Deploy**: Production deployment with automatic releases

## 🔧 Required Secrets

Add these secrets to your GitHub repository settings (`Settings > Secrets and variables > Actions`):

### Supabase Configuration

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Vercel Deployment (Optional)

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
```

## 📝 Setup Instructions

### 1. GitHub Repository Setup

1. Ensure your repository has `main` and `develop` branches
2. Add the required secrets (see above)
3. Enable GitHub Actions in repository settings

### 2. Supabase Secrets Setup

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the **Project URL** and **anon public** key
4. Add them as GitHub secrets

### 3. Vercel Setup (Optional)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel login` and authenticate
3. Run `vercel` in your project directory to link it
4. Get your tokens from Vercel dashboard:
   - **Token**: Account Settings → Tokens
   - **Org ID**: Team Settings → General
   - **Project ID**: Project Settings → General

### 4. Branch Protection Rules (Recommended)

Set up branch protection for `main`:

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Require pull request reviews
   - ✅ Dismiss stale reviews

## 🔄 Workflow Triggers

### Automatic Triggers

- **Push to `main`**: Runs CI + Production deployment
- **Push to `develop`**: Runs CI only
- **Pull Request**: Runs CI + Preview deployment
- **Pull Request to `main`**: Runs full CI suite

### Manual Triggers

- **Production Deployment**: Can be triggered manually from Actions tab
- **Workflow Dispatch**: Available for both workflows

## 📊 Pipeline Status

### CI Pipeline Checks

- ✅ **Linting**: ESLint with Next.js configuration
- ✅ **Type Checking**: TypeScript strict mode validation
- ✅ **Build**: Production build verification
- ✅ **Security**: npm audit and vulnerability scanning
- ✅ **Code Quality**: Prettier formatting and dependency analysis
- ✅ **Multi-Node**: Tests on Node.js 18.x and 20.x

### Deployment Pipeline

- ✅ **Preview**: Automatic preview deployments for PRs
- ✅ **Production**: Automatic production deployment from main
- ✅ **Releases**: Automatic GitHub releases with versioning

## 🛠️ Local Development

### Running CI Checks Locally

```bash
# Install dependencies
npm ci

# Run linting
npm run lint

# Type checking
npx tsc --noEmit

# Build application
npm run build

# Security audit
npm audit --audit-level=high

# Check formatting
npx prettier --check .

# Check unused dependencies
npx depcheck
```

### Pre-commit Hooks (Optional)

Add to `package.json`:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npx tsc --noEmit",
      "pre-push": "npm run build"
    }
  }
}
```

## 🚨 Troubleshooting

### Common Issues

**Build Fails on Missing Environment Variables**

- Ensure Supabase secrets are added to GitHub repository
- Check secret names match exactly

**Vercel Deployment Fails**

- Verify Vercel tokens are correct and not expired
- Ensure project is properly linked to Vercel

**Security Audit Fails**

- Run `npm audit fix` to resolve vulnerabilities
- Update dependencies if needed

**Type Checking Fails**

- Run `npx tsc --noEmit` locally to see errors
- Fix TypeScript errors before pushing

### Getting Help

1. Check the Actions tab for detailed error logs
2. Review the specific job that failed
3. Run the same commands locally to reproduce issues
4. Check GitHub Actions documentation for action-specific issues

## 📈 Monitoring

### Pipeline Metrics

- **Build Time**: Monitor build duration trends
- **Success Rate**: Track pipeline success/failure rates
- **Security**: Monitor vulnerability reports
- **Dependencies**: Track outdated packages

### Notifications

- **Slack/Discord**: Add webhook notifications for failures
- **Email**: GitHub can send email notifications for failed workflows
- **Status Badges**: Add status badges to README.md

## 🔄 Maintenance

### Regular Tasks

- **Monthly**: Review and update dependencies
- **Quarterly**: Update GitHub Actions versions
- **As Needed**: Rotate Vercel tokens and secrets

### Dependency Updates

```bash
# Check outdated packages
npm outdated

# Update dependencies
npm update

# Update major versions carefully
npm install package@latest
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0

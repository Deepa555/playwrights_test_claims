# Manual Git Commands for Pushing to GitHub

If you prefer to run git commands manually, here are the steps:

## 📋 Manual Commands

### 1. Initialize Git Repository (if needed)
```bash
git init
```

### 2. Add Remote Repository
```bash
git remote add origin https://github.com/Deepa555/playwrights_test_claims.git
```

### 3. Stage All Files
```bash
git add .
```

### 4. Commit Changes
```bash
git commit -m "Initial commit: Playwright test automation for Azure Blue claims testing

- Complete test automation framework setup
- Login and dashboard test suites  
- Helper classes for maintainable code
- CI/CD pipeline configuration (Azure DevOps + GitHub Actions)
- Cross-browser testing support
- Environment configuration management
- Comprehensive documentation and setup guides"
```

### 5. Set Main Branch
```bash
git branch -M main
```

### 6. Push to GitHub
```bash
git push -u origin main
```

## 🔐 Authentication Options

### Option 1: Personal Access Token (Recommended)
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token with 'repo' permissions
3. Use token as password when prompted

### Option 2: SSH Key
1. Generate SSH key: `ssh-keygen -t ed25519 -C "your_email@example.com"`
2. Add to GitHub: Settings → SSH and GPG keys
3. Use SSH URL: `git remote set-url origin git@github.com:Deepa555/playwrights_test_claims.git`

### Option 3: GitHub CLI
```bash
# Install GitHub CLI first
gh auth login
git push -u origin main
```

## 🚨 Common Issues

### Repository Already Exists
If the repository already has content:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Authentication Failed
- Verify repository URL and permissions
- Use Personal Access Token instead of password
- Check if 2FA is enabled on GitHub account

### Permission Denied
- Ensure you have write access to the repository
- Verify you're pushing to the correct repository
- Check if repository is private and you have access

## ✅ Verification Steps

After pushing, verify:
1. Go to https://github.com/Deepa555/playwrights_test_claims
2. Check all files are present
3. Verify GitHub Actions workflow is available
4. Set up repository secrets for CI/CD

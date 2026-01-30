# 🚀 Quick Start Guide - GitHub Actions CI/CD

**TL;DR**: Get your CI/CD pipeline running in 5 minutes.

---

## ⚡ Super Fast Setup

### 1. Push to GitHub (2 minutes)

```bash
# Navigate to project
cd "C:\Users\muhar\Documents\important shiz\C270 (2nd attempt)\Submission\CA2(non corrupted)\Gallery-website"

# Initialize git (if needed)
git init
git add .
git commit -m "Initial commit: Gallery with CI/CD"

# Create GitHub repo and push (using GitHub CLI)
gh auth login
gh repo create gallery-website --public --source=. --remote=origin --push
```

**OR** without GitHub CLI:
```bash
# Create repo manually on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Actions (30 seconds)

1. Go to your repo on GitHub
2. Click **Actions** tab
3. Click **I understand my workflows, go ahead and enable them**

### 3. Watch It Run (3 minutes)

Pipeline automatically triggers on push. Watch the magic happen:

- 🧪 **Test** → Validates your gallery
- 🏗️ **Build** → Creates Docker image
- 🔒 **Security Scan** → Checks vulnerabilities
- 📦 **Push** → Uploads to registry
- 🚀 **Deploy** → Ready for deployment

### 4. Fix Permissions (if needed)

If registry push fails:

1. **Settings** → **Actions** → **General**
2. **Workflow permissions** → Select **Read and write permissions**
3. **Save**

---

## 🧪 Test Locally First

```bash
# Run tests
npm test

# Build Docker image
docker build -t gallery-website:test .

# Run container
docker run -d -p 8080:80 --name test gallery-website:test

# Test it
start http://localhost:8080

# Clean up
docker stop test && docker rm test
```

---

## 📦 What You Get

### Automatic on Every Push:

✅ **Automated Testing**
- Validates HTML structure
- Checks all files exist
- Verifies images.json
- Syntax validation

✅ **Docker Build**
- Creates optimized nginx container
- Health checks included
- Saves as artifact

✅ **Security Scanning**
- Trivy vulnerability scan
- Reports in Security tab
- Blocks critical issues

✅ **Registry Push** (main branch only)
- Pushes to GitHub Container Registry
- Tagged with commit SHA
- Available at: `ghcr.io/YOUR_USERNAME/gallery-website:latest`

✅ **Deployment Ready**
- Placeholder for your deployment
- Easy to configure

---

## 🎯 Common Commands

### Git Operations
```bash
# Make changes and trigger pipeline
git add .
git commit -m "Update: Description of changes"
git push origin main

# Create feature branch
git checkout -b feature/new-images
git push origin feature/new-images

# Create PR (triggers pipeline)
gh pr create --title "Add new images" --body "Description"
```

### Docker Commands
```bash
# Local development
npm run serve                    # Python server on :8000
npm run docker:build             # Build image
npm run docker:run               # Run container
npm run docker:stop              # Stop container
npm run docker:compose:up        # Start with compose
npm run docker:compose:down      # Stop compose

# Pull from registry (after pipeline runs)
docker pull ghcr.io/YOUR_USERNAME/gallery-website:latest
docker run -d -p 8080:80 ghcr.io/YOUR_USERNAME/gallery-website:latest
```

### Testing
```bash
npm test                         # Run all tests
node tests/test-gallery.js       # Run tests directly
```

---

## 🔧 Quick Deployment Setup

### Option 1: GitHub Pages (Easiest)

1. **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages**
4. Update workflow deploy job (see IMPLEMENTATION-GUIDE.md)
5. Access at: `https://YOUR_USERNAME.github.io/REPO_NAME/`

### Option 2: SSH to Server

1. Add secrets in **Settings** → **Secrets**:
   - `DEPLOY_HOST`: server IP
   - `DEPLOY_USER`: SSH user
   - `DEPLOY_KEY`: SSH private key

2. Update deploy job in `.github/workflows/ci-cd-pipeline.yml`

3. Push to trigger deployment

### Option 3: Pull Image Manually

```bash
# On your server
docker pull ghcr.io/YOUR_USERNAME/gallery-website:latest
docker run -d -p 80:80 --name gallery ghcr.io/YOUR_USERNAME/gallery-website:latest
```

---

## 🐛 Quick Troubleshooting

### Pipeline Fails on Test
```bash
# Run locally to debug
npm test
```

### Docker Build Fails
```bash
# Test build locally
docker build -t test .
```

### Permission Denied (403)
- **Settings** → **Actions** → **General**
- Enable **Read and write permissions**

### Container Won't Start
```bash
# Check logs
docker logs gallery-website

# Test health
curl http://localhost:8080/health
```

---

## 📚 Full Documentation

- **README.md**: Complete project documentation
- **IMPLEMENTATION-GUIDE.md**: Detailed step-by-step setup
- **This file**: Quick reference

---

## 🎓 For Your School Project

### What to Show Your Professor:

1. **GitHub Actions Tab**: Show successful pipeline runs
2. **Security Tab**: Show vulnerability scanning
3. **Packages Section**: Show published Docker image
4. **README.md**: Comprehensive documentation
5. **Tests**: Show automated validation

### What to Explain:

- **CI/CD Pipeline**: Automated testing, building, and deployment
- **Containerization**: Docker for consistent environments
- **Security**: Automated vulnerability scanning
- **Quality Assurance**: Automated tests prevent broken deployments
- **DevOps Best Practices**: Infrastructure as Code, GitOps workflow

### Bonus Points:

- Show branch protection rules
- Demonstrate PR workflow with checks
- Show deployment to actual server
- Explain security scan results
- Show monitoring/health checks

---

## 🎉 You're Done!

Your CI/CD pipeline is now:
- ✅ Automatically testing your code
- ✅ Building Docker images
- ✅ Scanning for security issues
- ✅ Publishing to registry
- ✅ Ready for deployment

**Every push to main** triggers the full pipeline. No manual steps needed.

---

**Need Help?** Check IMPLEMENTATION-GUIDE.md for detailed instructions.

**© 2025 Kazlabs - Made with ♥ by Liam Sorensen**

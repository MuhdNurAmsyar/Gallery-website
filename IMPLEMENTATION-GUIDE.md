# GitHub Actions CI/CD Implementation Guide

**Project**: Gallery Website  
**Author**: Muhammad Harith  
**Date**: 2026-01-27  
**Pipeline Type**: GitHub Actions (replaced Jenkins)

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step-by-Step Implementation](#step-by-step-implementation)
3. [Testing the Pipeline](#testing-the-pipeline)
4. [Deployment Configuration](#deployment-configuration)
5. [Troubleshooting](#troubleshooting)
6. [Advanced Configuration](#advanced-configuration)

---

## Prerequisites

Before implementing the CI/CD pipeline, ensure you have:

### Required
- ✅ GitHub account
- ✅ Git installed locally
- ✅ Repository hosted on GitHub
- ✅ Docker installed (for local testing)
- ✅ Node.js 18+ installed (for running tests)

### Optional (for deployment)
- SSH access to deployment server
- Kubernetes cluster (if deploying to K8s)
- Cloud provider account (AWS, Azure, GCP)

---

## Step-by-Step Implementation

### Step 1: Initialize Git Repository (If Not Already Done)

```bash
# Navigate to your project directory
cd "C:\Users\muhar\Documents\important shiz\C270 (2nd attempt)\Submission\CA2(non corrupted)\Gallery-website"

# Initialize git (skip if already initialized)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Gallery website with CI/CD pipeline"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click **New Repository** (green button)
3. Fill in details:
   - **Repository name**: `gallery-website` (or your preferred name)
   - **Description**: "Gallery website with automated CI/CD pipeline"
   - **Visibility**: Public or Private (your choice)
   - **DO NOT** initialize with README (we already have one)
4. Click **Create repository**

### Step 3: Connect Local Repository to GitHub

```bash
# Add GitHub remote (replace USERNAME and REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Verify remote was added
git remote -v

# Push to GitHub (use 'main' or 'master' depending on your default branch)
git branch -M main
git push -u origin main
```

**Windows PowerShell Alternative:**
```powershell
# If you get authentication errors, use GitHub CLI
# Install: winget install GitHub.cli

# Authenticate
gh auth login

# Create repo and push
gh repo create gallery-website --public --source=. --remote=origin --push
```

### Step 4: Verify Pipeline Files Exist

Check that these files were pushed to GitHub:

```
.github/
└── workflows/
    └── ci-cd-pipeline.yml    ✅ This triggers the CI/CD pipeline

Dockerfile                     ✅ Builds the container
docker-compose.yml             ✅ Orchestrates containers
.dockerignore                  ✅ Excludes unnecessary files
tests/test-gallery.js          ✅ Runs validation tests
package.json                   ✅ Defines npm scripts
```

### Step 5: Enable GitHub Actions

1. Go to your repository on GitHub
2. Click **Actions** tab
3. If prompted, click **I understand my workflows, go ahead and enable them**
4. You should see "Gallery Website CI/CD Pipeline" workflow

### Step 6: Trigger First Pipeline Run

**Option A: Push a Change**
```bash
# Make a small change (e.g., update README)
echo "# Test" >> README.md

# Commit and push
git add README.md
git commit -m "Test: Trigger CI/CD pipeline"
git push origin main
```

**Option B: Manual Trigger**
1. Go to **Actions** tab
2. Click **Gallery Website CI/CD Pipeline**
3. Click **Run workflow** dropdown
4. Select branch (main)
5. Click **Run workflow** button

### Step 7: Monitor Pipeline Execution

1. Go to **Actions** tab
2. Click on the running workflow
3. Watch each job execute:
   - 🧪 **Test**: Validates gallery structure (~30 seconds)
   - 🏗️ **Build**: Creates Docker image (~1-2 minutes)
   - 🔒 **Security Scan**: Checks for vulnerabilities (~1 minute)
   - 📦 **Push to Registry**: Uploads to ghcr.io (~1 minute)
   - 🚀 **Deploy**: Deployment notification (~10 seconds)

### Step 8: Verify Pipeline Success

#### Check Test Results
1. Click **Test** job
2. Expand "Run gallery validation tests"
3. Verify all tests passed:
   ```
   ✓ index.html file exists
   ✓ index.html contains required structure
   ✓ css_styles.css file exists
   ✓ js_script.js file exists
   ✓ images.json is valid JSON array
   ✓ images/ directory exists
   ✓ All images listed in images.json exist
   ✓ Dockerfile exists for containerization
   ✓ js_script.js has valid JavaScript syntax
   ✓ README.md documentation exists
   ```

#### Check Docker Build
1. Click **Build** job
2. Expand "Build Docker image"
3. Verify successful build
4. Expand "Test Docker image"
5. Confirm health check passed

#### Check Security Scan
1. Click **Security Scan** job
2. Review Trivy scan results
3. Go to **Security** tab → **Code scanning**
4. Review any vulnerabilities found

#### Check Registry Push
1. Click **Push to Registry** job
2. Verify image was pushed
3. Go to repository **Packages** section
4. Confirm `gallery-website` package exists

---

## Testing the Pipeline

### Local Testing Before Pushing

#### Run Tests Locally
```bash
# Run the test suite
npm test

# Expected output: All 10 tests should pass
```

#### Test Docker Build Locally
```bash
# Build image
docker build -t gallery-website:test .

# Run container
docker run -d -p 8080:80 --name test-gallery gallery-website:test

# Test health endpoint
curl http://localhost:8080/health

# Test main page
curl http://localhost:8080/

# View in browser
start http://localhost:8080

# Clean up
docker stop test-gallery
docker rm test-gallery
```

#### Test Docker Compose Locally
```bash
# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Test application
start http://localhost:8080

# Stop services
docker-compose down
```

### Testing Pipeline Triggers

The pipeline triggers on:

1. **Push to main/master/develop**
   ```bash
   git add .
   git commit -m "Update: Test pipeline trigger"
   git push origin main
   ```

2. **Pull Request to main/master**
   ```bash
   # Create feature branch
   git checkout -b feature/test-pipeline
   
   # Make changes
   echo "test" >> test.txt
   git add test.txt
   git commit -m "Test PR pipeline"
   git push origin feature/test-pipeline
   
   # Create PR on GitHub
   gh pr create --title "Test Pipeline" --body "Testing CI/CD"
   ```

3. **Manual Workflow Dispatch**
   - Go to Actions → Select workflow → Run workflow

---

## Deployment Configuration

The pipeline includes a placeholder `deploy` job. Configure it based on your deployment target.

### Option 1: Deploy to Remote Server via SSH

#### Step 1: Generate SSH Key Pair
```bash
# On your local machine
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy

# Copy public key to server
ssh-copy-id -i ~/.ssh/github_deploy.pub user@your-server.com
```

#### Step 2: Add Secrets to GitHub
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add these secrets:
   - `DEPLOY_HOST`: Your server IP/domain
   - `DEPLOY_USER`: SSH username
   - `DEPLOY_KEY`: Contents of `~/.ssh/github_deploy` (private key)

#### Step 3: Update Deploy Job
Edit `.github/workflows/ci-cd-pipeline.yml`:

```yaml
deploy:
  name: Deploy Application
  runs-on: ubuntu-latest
  needs: push-registry
  if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master')
  
  steps:
    - name: Deploy to server via SSH
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.DEPLOY_HOST }}
        username: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_KEY }}
        script: |
          echo "[$(date -Iseconds)] [Deploy] [INFO] Pulling latest image"
          cd /opt/gallery-website
          docker-compose pull
          docker-compose up -d
          echo "[$(date -Iseconds)] [Deploy] [INFO] Deployment complete"
```

#### Step 4: Prepare Server
```bash
# SSH to your server
ssh user@your-server.com

# Create deployment directory
sudo mkdir -p /opt/gallery-website
cd /opt/gallery-website

# Create docker-compose.yml
cat > docker-compose.yml <<'EOF'
version: '3.8'
services:
  gallery-web:
    image: ghcr.io/YOUR_GITHUB_USERNAME/gallery-website:latest
    container_name: gallery-website
    ports:
      - "80:80"
    restart: unless-stopped
EOF

# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Pull and start
docker-compose pull
docker-compose up -d
```

### Option 2: Deploy to GitHub Pages

#### Step 1: Enable GitHub Pages
1. Go to **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** (will be created by action)
4. Click **Save**

#### Step 2: Update Deploy Job
```yaml
deploy:
  name: Deploy to GitHub Pages
  runs-on: ubuntu-latest
  needs: [test, build]
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  permissions:
    contents: write
  
  steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: .
        exclude_assets: '.github,tests,Dockerfile,docker-compose.yml,.dockerignore'
```

#### Step 3: Access Your Site
Your site will be available at:
```
https://YOUR_GITHUB_USERNAME.github.io/REPO_NAME/
```

### Option 3: Deploy to Kubernetes

#### Step 1: Create Kubernetes Manifests
Create `k8s/deployment.yml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gallery-website
spec:
  replicas: 3
  selector:
    matchLabels:
      app: gallery-website
  template:
    metadata:
      labels:
        app: gallery-website
    spec:
      containers:
      - name: gallery
        image: ghcr.io/YOUR_USERNAME/gallery-website:latest
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: gallery-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: gallery-website
```

#### Step 2: Add Kubeconfig Secret
1. Get your kubeconfig: `cat ~/.kube/config`
2. Add as secret: `KUBE_CONFIG` in GitHub

#### Step 3: Update Deploy Job
```yaml
deploy:
  name: Deploy to Kubernetes
  runs-on: ubuntu-latest
  needs: push-registry
  
  steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup kubectl
      uses: azure/setup-kubectl@v3
    
    - name: Configure kubectl
      run: |
        mkdir -p ~/.kube
        echo "${{ secrets.KUBE_CONFIG }}" > ~/.kube/config
    
    - name: Deploy to cluster
      run: |
        kubectl apply -f k8s/
        kubectl set image deployment/gallery-website \
          gallery=ghcr.io/${{ github.repository_owner }}/gallery-website:latest
        kubectl rollout status deployment/gallery-website
```

---

## Troubleshooting

### Pipeline Fails: Permission Denied

**Error**: `Error: Process completed with exit code 403`

**Solution**:
1. Go to **Settings** → **Actions** → **General**
2. Scroll to **Workflow permissions**
3. Select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

### Pipeline Fails: Test Stage

**Error**: `FAIL: All images listed in images.json exist`

**Solution**:
```bash
# Verify images.json matches actual files
node tests/test-gallery.js

# Check images directory
ls images/

# Ensure all images in JSON exist
cat images.json
```

### Pipeline Fails: Docker Build

**Error**: `COPY failed: file not found`

**Solution**:
- Verify all files in Dockerfile COPY commands exist
- Check `.dockerignore` isn't excluding required files
- Run local build: `docker build -t test .`

### Registry Push Fails

**Error**: `denied: permission_denied`

**Solution**:
1. Verify workflow has `packages: write` permission
2. Check repository visibility (public vs private)
3. Ensure `GITHUB_TOKEN` has correct scopes

### Container Won't Start

**Error**: `Health check failed`

**Solution**:
```bash
# Check container logs
docker logs gallery-website

# Test health endpoint
curl http://localhost:8080/health

# Verify nginx config
docker exec gallery-website cat /etc/nginx/conf.d/default.conf
```

### Security Scan Fails

**Error**: `Critical vulnerabilities found`

**Solution**:
- Review vulnerabilities in **Security** tab
- Update base image: `FROM nginx:1.25-alpine`
- Add to workflow if you want to ignore:
  ```yaml
  continue-on-error: true
  ```

---

## Advanced Configuration

### Enable Branch Protection

1. Go to **Settings** → **Branches**
2. Click **Add rule**
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Select: `test`, `build`, `security-scan`
5. Click **Create**

### Add Slack Notifications

Add to end of workflow:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Pipeline ${{ job.status }}'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Add Email Notifications

```yaml
- name: Send email on failure
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: 'Pipeline Failed: ${{ github.repository }}'
    to: your-email@example.com
    from: GitHub Actions
    body: 'Pipeline failed for commit ${{ github.sha }}'
```

### Cache Dependencies

Add to test job:

```yaml
- name: Cache Node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### Multi-Environment Deployment

```yaml
deploy-staging:
  if: github.ref == 'refs/heads/develop'
  environment: staging
  # ... deploy to staging

deploy-production:
  if: github.ref == 'refs/heads/main'
  environment: production
  # ... deploy to production
```

---

## Summary Checklist

- [ ] Git repository initialized
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] GitHub Actions enabled
- [ ] Pipeline triggered successfully
- [ ] All tests passing
- [ ] Docker image built
- [ ] Security scan completed
- [ ] Image pushed to registry
- [ ] Deployment configured (optional)
- [ ] Documentation reviewed

---

## Next Steps

1. **Test the pipeline**: Push a change and watch it run
2. **Configure deployment**: Choose and implement a deployment strategy
3. **Set up monitoring**: Add health checks and alerting
4. **Enable branch protection**: Require CI checks before merging
5. **Add more tests**: Expand test coverage as needed

---

## Support

If you encounter issues:

1. Check **Actions** tab for detailed logs
2. Review this guide's troubleshooting section
3. Check GitHub Actions documentation: https://docs.github.com/actions
4. Review Docker documentation: https://docs.docker.com

---

**© 2025 Kazlabs - Made with ♥ by Liam Sorensen**

<easter-egg="kaz was here 2025"></easter-egg>

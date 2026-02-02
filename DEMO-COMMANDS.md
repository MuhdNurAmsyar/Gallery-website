# Gallery Website - Demo Commands Reference
## For Presentation Demo (Feb 3, 2026)

```
╭───────────────────── DEMO COMMAND REFERENCE ─────────────────────╮
│ Quick reference for demonstrating all functionalities            │
│ Docker | Testing | Pipeline | Compose - All covered             │
╰──────────────── Made with ♥ by Muhammad Harith ─────────────────╯
```

---

## 🎯 PRESENTATION FLOW OVERVIEW

1. **Test Cases Demo** - Show that the code works
2. **Docker Build Demo** - Show containerization
3. **Docker Run Demo** - Show container execution
4. **Docker Compose Demo** - Show orchestration
5. **CI/CD Pipeline Demo** - Show automation
6. **Live Application Demo** - Show the actual website

---

## 🧪 1. TEST CASES DEMO

### Show Test Execution
**What it does:** Runs 11 validation tests for HTML structure, files, images, and functionality.

```powershell
# Navigate to project directory first
cd "C:\Users\muhar\Documents\important shiz\C270 (2nd attempt)\Submission\CA2\CA2(Prototype)\Gallery-website"

# Run the test suite
npm test
```

**Expected Output:**
- Green PASS messages for each test
- Total: 11 tests passed
- Success Rate: 100%
- Exit code: 0

**What to say:** 
> "This test suite validates the gallery structure, ensures all images exist, checks for required HTML elements like the lightbox and gallery div, and verifies that our Docker configuration is present. We have 11 tests covering file existence, JSON validity, and feature implementation."

---

## 🐳 2. DOCKER BUILD DEMO

### Build the Docker Image
**What it does:** Creates a containerized version of the website using nginx:alpine base.

```powershell
# Build the image with a tag
docker build -t gallery-website:latest .
```

**Expected Output:**
- Step 1/8 through 8/8 building
- Successfully tagged gallery-website:latest
- Image size: ~20-30MB (Alpine is tiny)

**Verify the build:**
```powershell
# List Docker images to confirm
docker images | Select-String "gallery-website"
```

**What to say:**
> "We're using nginx:alpine as our base image because we're not fucking around with bloated images. Alpine Linux keeps our container under 30MB. The Dockerfile copies our HTML, CSS, JS, images, and creates a custom nginx config with proper caching headers and a health check endpoint."

---

## 🚀 3. DOCKER RUN DEMO

### Run the Container
**What it does:** Starts the container and maps port 8080 to port 80 inside container.

```powershell
# Run container in detached mode
docker run -d -p 8080:80 --name gallery-website gallery-website:latest
```

**Expected Output:**
- Container ID (long hash)
- Container starts in background

### Verify Container is Running
```powershell
# Check container status
docker ps | Select-String "gallery-website"
```

**Expected Output:**
- Shows container ID, image, status (Up X seconds), ports (0.0.0.0:8080->80/tcp)

### Test the Health Endpoint
```powershell
# Test health check
curl http://localhost:8080/health
```

**Expected Output:**
```
healthy
```

### View Container Logs
```powershell
# Show nginx logs
docker logs gallery-website
```

**What to say:**
> "The container is now running with nginx serving our gallery on port 8080. The health endpoint returns 'healthy' which orchestrators like Kubernetes can use for monitoring. Docker's built-in healthcheck runs every 30 seconds to ensure the container is responsive."

### Open in Browser
```powershell
# Open the website
Start-Process "http://localhost:8080"
```

### Stop and Remove Container (cleanup)
```powershell
# Stop and remove
docker stop gallery-website
docker rm gallery-website
```

---

## 🎼 4. DOCKER COMPOSE DEMO

### Start with Docker Compose
**What it does:** Orchestrates the container with proper configuration, health checks, and restart policies.

```powershell
# Start the service
docker-compose up -d
```

**Expected Output:**
- Creating network "gallery-website_default"
- Building gallery-web
- Creating gallery-website ... done

### Check Compose Status
```powershell
# View running services
docker-compose ps
```

**Expected Output:**
```
Name                   Command             State          Ports
------------------------------------------------------------------------
gallery-website   nginx -g daemon off;   Up (healthy)   0.0.0.0:8080->80/tcp
```

### View Compose Logs
```powershell
# Tail logs
docker-compose logs -f gallery-web
```

**Press Ctrl+C to exit log viewing**

### Verify Application
```powershell
# Test the application
curl http://localhost:8080/
```

**What to say:**
> "Docker Compose provides service orchestration. It defines our service 'gallery-web', builds the image, sets up port mapping, configures health checks, and sets a restart policy to 'unless-stopped' so the container survives system reboots. This is a single-service setup, but Compose scales to multi-container applications like frontend + backend + database."

### Stop and Remove Compose Services
```powershell
# Tear down everything
docker-compose down
```

**Expected Output:**
- Stopping gallery-website ... done
- Removing gallery-website ... done
- Removing network gallery-website_default

---

## 🔄 5. CI/CD PIPELINE DEMO

### View Pipeline Configuration
**What it does:** Shows the GitHub Actions workflow that automates testing, building, security scanning, and deployment.

```powershell
# Display the pipeline file
Get-Content .github\workflows\ci-cd-pipeline.yml | Select-Object -First 50
```

### Pipeline Overview Explanation

**What to say:**
> "Our CI/CD pipeline has 5 jobs that run automatically on every push or pull request:"

**Job 1 - Test:**
- Runs on: `ubuntu-latest`
- Sets up Node.js 18
- Executes: `npm test`
- Uploads: Test results as artifacts

**Job 2 - Build:**
- Depends on: Test job passing
- Builds: Docker image
- Tests: Health endpoint and main page
- Validates: Container actually works
- Saves: Docker image as artifact

**Job 3 - Security Scan:**
- Uses: Trivy scanner
- Scans: Docker image for vulnerabilities
- Reports: Critical and High severity issues
- Uploads: Results to GitHub Security tab

**Job 4 - Push to Registry:**
- Only runs on: main/master branch
- Pushes to: GitHub Container Registry (ghcr.io)
- Tags with: branch name, commit SHA, and 'latest'
- Requires: Build and security scan to pass

**Job 5 - Deploy:**
- Only runs on: main/master branch
- Currently: Deployment placeholder
- Future: Would deploy to production server

### View Pipeline in GitHub (if repo exists)
```powershell
# Open GitHub Actions page (replace with your repo URL)
Start-Process "https://github.com/YOUR_USERNAME/YOUR_REPO/actions"
```

### Trigger Pipeline Manually (if setup)
**On GitHub:**
1. Go to Actions tab
2. Select "Gallery Website CI/CD Pipeline"
3. Click "Run workflow"
4. Select branch
5. Click "Run workflow" button

**What to say:**
> "The pipeline ensures code quality through automated testing, creates reproducible builds with Docker, scans for security vulnerabilities with Trivy, and only deploys if all previous stages pass. This implements continuous integration and continuous deployment best practices."

---

## 🌐 6. LIVE APPLICATION DEMO

### Start Application for Demo
```powershell
# Quick start with compose
docker-compose up -d

# Wait 5 seconds for startup
Start-Sleep -Seconds 5

# Open in browser
Start-Process "http://localhost:8080"
```

### Features to Demonstrate

#### 1. **Main Gallery View**
- Show 6 animal images in grid layout
- Responsive grid that adapts to screen size
- Each image is clickable

#### 2. **Welcome Button**
- Click the "Welcome!" button at top
- Shows modal overlay with welcome message
- Can close by clicking X or clicking outside modal

#### 3. **Lightbox Functionality**
- Click any image in gallery
- Opens full-size view in lightbox overlay
- Shows image title
- Click close button or outside image to exit
- Test with multiple different images

#### 4. **Responsive Design**
- Resize browser window
- Show grid adjusting from 3 columns to 2 to 1
- Mobile-friendly design

#### 5. **Image Loading**
- Images loaded from `images.json` configuration
- Dynamically populated with JavaScript
- Show browser dev tools console (F12) - no errors

### Technical Details to Mention

**Architecture:**
```
nginx:alpine (5MB base)
├── index.html (Gallery structure)
├── css_styles.css (Styling + responsive grid)
├── js_script.js (Dynamic loading + lightbox + welcome)
├── images.json (Image manifest)
└── images/ (6 animal photos)
```

**Nginx Features:**
- Cache headers: 7 days for images, 1 day for code
- Health endpoint: `/health` for monitoring
- SPA fallback: All routes serve index.html
- MIME types: Proper content-type headers

**What to say:**
> "The application is served by nginx on Alpine Linux. Images are dynamically loaded from images.json using vanilla JavaScript. The lightbox provides full-size image viewing, and the welcome modal demonstrates interactive features. All CSS is custom-written with mobile-first responsive design using CSS Grid."

---

## 🔧 TROUBLESHOOTING COMMANDS

### If Port 8080 is Already in Use
```powershell
# Find what's using port 8080
netstat -ano | Select-String ":8080"

# Kill the process (replace PID with actual process ID)
Stop-Process -Id <PID> -Force

# OR use different port
docker run -d -p 9090:80 --name gallery-website gallery-website:latest
```

### If Container Won't Start
```powershell
# Check detailed logs
docker logs gallery-website

# Check if image exists
docker images

# Force rebuild
docker build --no-cache -t gallery-website:latest .
```

### If Tests Fail
```powershell
# Check Node.js version
node --version

# Ensure you're in correct directory
Get-Location

# Run tests with verbose output
node tests/test-gallery.js
```

### Clean Everything and Start Fresh
```powershell
# Stop all containers
docker stop $(docker ps -aq)

# Remove all containers
docker rm $(docker ps -aq)

# Remove gallery image
docker rmi gallery-website:latest

# Remove compose resources
docker-compose down -v

# Rebuild from scratch
docker build -t gallery-website:latest .
docker-compose up -d
```

---

## 📋 QUICK COMMAND CHEATSHEET

### Test Suite
```powershell
npm test
```

### Docker Build & Run
```powershell
docker build -t gallery-website:latest .
docker run -d -p 8080:80 --name gallery-website gallery-website:latest
docker ps
docker logs gallery-website
docker stop gallery-website && docker rm gallery-website
```

### Docker Compose
```powershell
docker-compose up -d
docker-compose ps
docker-compose logs -f
docker-compose down
```

### Health Check
```powershell
curl http://localhost:8080/health
```

### Open Application
```powershell
Start-Process "http://localhost:8080"
```

---

## 🎤 PRESENTATION TIPS

1. **Pre-demo Setup:**
   - Close all browsers to start fresh
   - Open PowerShell in project directory
   - Have this file open in second monitor/split screen
   - Pull up Docker Desktop to show container status visually

2. **Demo Order:**
   - Start with tests (shows code quality)
   - Build Docker image (shows packaging)
   - Run container (shows deployment)
   - Show compose (shows orchestration)
   - Explain pipeline (shows automation)
   - Demo live app (shows final product)

3. **What to Emphasize:**
   - **Tests:** Automated validation catches issues early
   - **Docker:** Consistency across environments ("works on my machine" solved)
   - **Compose:** Production-ready orchestration with health checks
   - **Pipeline:** Full automation from commit to deployment
   - **Security:** Vulnerability scanning with Trivy
   - **Logging:** Structured format with timestamps

4. **Common Questions & Answers:**

   **Q: Why nginx?**
   > "Static content server, battle-tested, minimal resource usage, and the alpine variant is only 5MB."

   **Q: Why not Docker Hub?**
   > "GitHub Container Registry integrates directly with our repo, provides better access control, and is free for public repos."

   **Q: What about secrets management?**
   > "GitHub Actions uses encrypted secrets. For production, we'd use a secrets manager like HashiCorp Vault or AWS Secrets Manager."

   **Q: How do you handle database persistence?**
   > "This is a static site, but for databases we'd use Docker volumes or external managed services like RDS."

   **Q: What if a test fails in the pipeline?**
   > "The pipeline stops immediately. Build, security scan, and deployment jobs never run if tests fail. This prevents broken code from reaching production."

   **Q: Is this production-ready?**
   > "For a static gallery, yes. For production with user data, we'd add: SSL/TLS certificates, CDN for images, monitoring/alerting, backup strategy, and proper secrets management."

---

## 🚨 EMERGENCY BACKUP COMMANDS

### If Docker Desktop is Acting Up
```powershell
# Restart Docker service
Restart-Service docker

# OR restart Docker Desktop app
Stop-Process -Name "Docker Desktop" -Force
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

### If npm test Fails
```powershell
# Run test file directly with Node
node tests/test-gallery.js
```

### If localhost Won't Load
```powershell
# Check if container is actually running
docker ps

# Check health status
docker inspect gallery-website | Select-String "Health"

# Try IP instead of localhost
Start-Process "http://127.0.0.1:8080"
```

---

## 📁 PROJECT FILE STRUCTURE
```
Gallery-website/
├── .github/
│   └── workflows/
│       └── ci-cd-pipeline.yml    # CI/CD automation
├── images/                        # Gallery images (6 animals)
│   ├── bird.jpg
│   ├── Deer.jpg
│   ├── hippopotamus.jpg
│   ├── raccoon.jpg
│   ├── wolf.jpg
│   └── zebra.jpg
├── tests/
│   └── test-gallery.js           # Test suite (11 tests)
├── index.html                     # Main HTML structure
├── css_styles.css                # Styling + responsive
├── js_script.js                  # Dynamic loading + features
├── images.json                   # Image manifest
├── Dockerfile                    # Container definition
├── docker-compose.yml            # Orchestration config
├── package.json                  # Scripts + metadata
└── README.md                     # Project documentation
```

---

## ✅ PRE-PRESENTATION CHECKLIST

**30 Minutes Before:**
- [ ] Pull latest code: `git pull`
- [ ] Clean Docker: `docker system prune -f`
- [ ] Test build: `docker build -t gallery-website:latest .`
- [ ] Test run: `docker-compose up -d && curl http://localhost:8080/health`
- [ ] Cleanup: `docker-compose down`

**10 Minutes Before:**
- [ ] Close all browsers
- [ ] Close unnecessary applications
- [ ] Open PowerShell in project directory
- [ ] Have this DEMO-COMMANDS.md file visible
- [ ] Check Docker Desktop is running
- [ ] Verify no containers running: `docker ps`

**During Demo:**
- [ ] Run tests first
- [ ] Build Docker image
- [ ] Run single container
- [ ] Show compose orchestration
- [ ] Explain pipeline jobs
- [ ] Demo live application
- [ ] Answer questions confidently

---

## 🎯 SUCCESS METRICS TO MENTION

- **Test Coverage:** 11 automated tests
- **Image Size:** ~25MB (nginx:alpine efficiency)
- **Build Time:** ~30 seconds
- **Container Startup:** <5 seconds
- **Health Check:** 30-second intervals
- **Pipeline Jobs:** 5 automated stages
- **Deployment Time:** <5 minutes (full pipeline)
- **Zero Downtime:** Health checks + restart policies

---

## 🔗 USEFUL URLS

**Local Application:**
- Main site: http://localhost:8080
- Health check: http://localhost:8080/health

**GitHub (if pushed):**
- Repository: https://github.com/YOUR_USERNAME/gallery-website
- Actions: https://github.com/YOUR_USERNAME/gallery-website/actions
- Packages: https://github.com/YOUR_USERNAME?tab=packages

**Documentation:**
- Docker: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose
- GitHub Actions: https://docs.github.com/actions
- Trivy Scanner: https://aquasecurity.github.io/trivy

---

## 💡 FINAL NOTES

This is a comprehensive production-grade setup for a static gallery website that demonstrates:

- ✅ **Version Control:** Git-based workflow
- ✅ **Testing:** Automated validation
- ✅ **Containerization:** Docker for consistency
- ✅ **Orchestration:** Docker Compose for management
- ✅ **CI/CD:** GitHub Actions automation
- ✅ **Security:** Trivy vulnerability scanning
- ✅ **Monitoring:** Health checks
- ✅ **Logging:** Structured format
- ✅ **Documentation:** Comprehensive README + comments

**You've built something solid. Now go fucking nail that presentation.**

---

<easter-egg="Harith was here 2026">

Made with ♥ by Muhammad Harith

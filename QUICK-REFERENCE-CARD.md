# 🎯 Quick Reference Card - Gallery Website Demo

## ⚡ ONE-COMMAND DEMO
```powershell
.\demo-presentation.ps1
```
*Runs everything automatically with prompts between steps*

---

## 🧪 TEST COMMANDS
```powershell
npm test                                    # Run all 11 tests
node tests/test-gallery.js                  # Run tests directly
```

---

## 🐳 DOCKER COMMANDS

### Build
```powershell
docker build -t gallery-website:latest .
```

### Run Single Container
```powershell
docker run -d -p 8080:80 --name gallery-website gallery-website:latest
docker ps                                   # Check status
docker logs gallery-website                 # View logs
curl http://localhost:8080/health          # Health check
Start-Process "http://localhost:8080"      # Open browser
docker stop gallery-website && docker rm gallery-website
```

### Docker Compose
```powershell
docker-compose up -d                        # Start
docker-compose ps                           # Status
docker-compose logs -f                      # Follow logs
docker-compose down                         # Stop
```

---

## 🔍 VERIFICATION COMMANDS
```powershell
docker images gallery-website              # Check image
docker ps | Select-String gallery          # Check container
curl http://localhost:8080/health          # Health check
curl http://localhost:8080/                # Test main page
```

---

## 🧹 CLEANUP COMMANDS
```powershell
.\demo-presentation.ps1 -CleanupOnly       # Clean everything
docker-compose down                         # Stop compose
docker stop gallery-website && docker rm gallery-website
docker rmi gallery-website:latest          # Remove image
```

---

## 🎤 DEMO TALKING POINTS

### Tests (30 seconds)
"11 automated tests validate HTML structure, file existence, JSON validity, and features like the welcome button and lightbox."

### Docker Build (30 seconds)
"Using nginx:alpine base keeps image under 30MB. Dockerfile includes custom nginx config with caching headers and health endpoint."

### Docker Run (1 minute)
"Container starts in seconds, health check runs every 30s. The /health endpoint enables monitoring by orchestrators like Kubernetes."

### Docker Compose (1 minute)
"Compose orchestrates the service with proper networking, health checks, and restart policies. Scales to multi-container apps."

### Pipeline (2 minutes)
"5-stage pipeline: Test → Build → Security Scan → Registry Push → Deploy. Runs on every push/PR. Uses Trivy for vulnerability scanning."

### Live App (1 minute)
"Dynamic image loading from JSON, lightbox for full-size viewing, welcome modal, responsive CSS Grid design."

---

## ❓ COMMON QUESTIONS

**Q: Why nginx?**
"Battle-tested, minimal resources, alpine is only 5MB."

**Q: Why GitHub Container Registry?**
"Direct repo integration, better access control, free for public."

**Q: Production-ready?**
"For static content, yes. Would add: SSL/TLS, CDN, monitoring, backups for production with user data."

**Q: What if test fails in pipeline?**
"Pipeline stops immediately. Build and deploy never run if tests fail."

---

## 📊 SUCCESS METRICS
- 11 automated tests
- ~25MB image size
- <5s container startup
- 30s health check intervals
- 5 pipeline stages
- <5min full deployment

---

## 🚨 EMERGENCY FIXES

### Port 8080 in use
```powershell
netstat -ano | Select-String ":8080"
Stop-Process -Id <PID> -Force
```

### Container won't start
```powershell
docker logs gallery-website
docker build --no-cache -t gallery-website:latest .
```

### Browser won't load
```powershell
docker ps                                   # Verify running
Start-Process "http://127.0.0.1:8080"      # Try IP
```

---

## ✅ PRE-DEMO CHECKLIST
- [ ] `cd` to Gallery-website directory
- [ ] Run: `.\demo-presentation.ps1 -CleanupOnly`
- [ ] Close all browsers
- [ ] Have this card visible
- [ ] Docker Desktop running
- [ ] Test once: `npm test`

---

**Made with ♥ by Muhammad Harith**

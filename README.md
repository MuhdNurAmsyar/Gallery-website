# Gallery Website with CI/CD Pipeline

A modern, containerized static gallery website with automated testing and deployment via GitHub Actions.

## 🎯 Features

- **Responsive Gallery**: Grid-based image gallery with lightbox functionality
- **Welcome Button**: Interactive welcome button that greets users and tracks engagement
- **Easter Egg**: Hidden feature button for testing and entertainment
- **Containerized**: Fully Dockerized with nginx alpine for minimal footprint
- **CI/CD Pipeline**: Automated testing, building, security scanning, and deployment
- **Health Monitoring**: Built-in health check endpoints for orchestration
- **Automated Testing**: Comprehensive validation suite for all gallery components

## 🚀 Quick Start

### Local Development

```bash
# Serve with Python
npm run serve
# Access at http://localhost:8000

# Or use Docker Compose
npm run docker:compose:up
# Access at http://localhost:8080
```

### Docker Commands

```bash
# Build image
npm run docker:build

# Run container
npm run docker:run

# Stop container
npm run docker:stop

# Docker Compose
npm run docker:compose:up    # Start services
npm run docker:compose:down  # Stop services
```

### Run Tests

```bash
npm test
```

## 📁 Project Structure

```
Gallery-website/
├── .github/
│   └── workflows/
│       └── ci-cd-pipeline.yml    # GitHub Actions CI/CD pipeline
├── images/                        # Gallery images directory
├── tests/
│   └── test-gallery.js           # Automated test suite
├── index.html                     # Main gallery page
├── css_styles.css                 # Styling
├── js_script.js                   # Gallery functionality
├── images.json                    # Image manifest
├── Dockerfile                     # Container build instructions
├── docker-compose.yml             # Multi-container orchestration
├── .dockerignore                  # Docker build exclusions
└── package.json                   # Project metadata and scripts
```

## 🔄 CI/CD Pipeline

The GitHub Actions pipeline automatically runs on push/PR to main/master/develop branches.

### Pipeline Stages

1. **Test** 🧪
   - Validates HTML structure
   - Checks file existence (CSS, JS, images)
   - Validates `images.json` format
   - Verifies image references
   - Runs syntax checks

2. **Build** 🏗️
   - Builds Docker image using nginx alpine
   - Runs container health checks
   - Tests HTTP endpoints
   - Saves image as artifact

3. **Security Scan** 🔒
   - Scans image with Trivy for vulnerabilities
   - Reports CRITICAL and HIGH severity issues
   - Uploads results to GitHub Security tab

4. **Push to Registry** 📦
   - Pushes to GitHub Container Registry (ghcr.io)
   - Tags with branch name, commit SHA, and 'latest'
   - Only runs on main/master branch pushes

5. **Deploy** 🚀
   - Deployment notification
   - Ready for custom deployment logic
   - Supports SSH, Kubernetes, cloud providers

### Viewing Pipeline Results

1. Go to your repository on GitHub
2. Click **Actions** tab
3. View workflow runs and detailed logs
4. Check **Security** tab for vulnerability reports

## 🔧 Configuration

### Adding Images

1. Add image files to `images/` directory
2. Update `images.json` with filenames:

```json
[
  "image1.jpg",
  "image2.jpg",
  "image3.jpg"
]
```

3. Commit and push - CI/CD will validate automatically

### Environment Variables

The pipeline uses these environment variables (configured in workflow):

- `IMAGE_NAME`: Docker image name (default: `gallery-website`)
- `REGISTRY`: Container registry (default: `ghcr.io`)
- `NODE_VERSION`: Node.js version for tests (default: `18`)

### Deployment Configuration

To enable automatic deployment, edit the `deploy` job in `.github/workflows/ci-cd-pipeline.yml`:

**Option 1: SSH Deployment**
```yaml
- name: Deploy to server
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.DEPLOY_HOST }}
    username: ${{ secrets.DEPLOY_USER }}
    key: ${{ secrets.DEPLOY_KEY }}
    script: |
      cd /path/to/app
      docker-compose pull
      docker-compose up -d
```

**Option 2: Kubernetes**
```yaml
- name: Deploy to Kubernetes
  run: |
    kubectl set image deployment/gallery-website \
      gallery-website=ghcr.io/${{ github.repository_owner }}/gallery-website:latest
```

**Option 3: GitHub Pages**
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: .
```

## 🔐 Required Secrets

For full pipeline functionality, configure these in **Settings → Secrets and variables → Actions**:

- `GITHUB_TOKEN`: Automatically provided by GitHub
- `DEPLOY_HOST`: Your deployment server (if using SSH)
- `DEPLOY_USER`: SSH username (if using SSH)
- `DEPLOY_KEY`: SSH private key (if using SSH)

## 📊 Monitoring

### Health Check Endpoint

```bash
curl http://localhost:8080/health
# Response: healthy
```

### Container Logs

```bash
# Docker
docker logs gallery-website

# Docker Compose
docker-compose logs -f
```

## 🧪 Testing

The test suite validates:

- ✅ HTML file existence and structure
- ✅ CSS and JavaScript files
- ✅ `images.json` validity
- ✅ Image directory and file references
- ✅ Dockerfile presence
- ✅ JavaScript syntax
- ✅ Documentation

Run tests locally:

```bash
node tests/test-gallery.js
```

## 🐳 Docker Details

**Base Image**: `nginx:alpine` (lightweight, secure)

**Exposed Ports**: 
- Container: `80`
- Host mapping: `8080:80`

**Health Check**: Runs every 30s, hits `/health` endpoint

**Nginx Configuration**:
- Proper MIME types for images
- Cache headers (7d for images, 1d for CSS/JS)
- SPA fallback routing
- Custom health endpoint

## 📝 How It Works

1. `index.html` displays a responsive grid of thumbnails
2. `js_script.js` reads `images.json` and dynamically builds the gallery
3. Images are loaded from the `images/` directory
4. Click a thumbnail to open the lightbox
5. Navigate with ← → arrow keys or Esc to close

## 🛠️ Troubleshooting

### Pipeline Fails on Test Stage
- Check that all files referenced in `images.json` exist in `images/`
- Verify HTML structure has `id="gallery"` and `id="lightbox"`
- Run `npm test` locally to debug

### Docker Build Fails
- Ensure all files in Dockerfile COPY commands exist
- Check `.dockerignore` isn't excluding required files
- Verify base image `nginx:alpine` is accessible

### Container Won't Start
- Check port 8080 isn't already in use: `netstat -an | findstr 8080`
- View container logs: `docker logs gallery-website`
- Verify health check endpoint: `curl http://localhost:8080/health`

### Security Scan Fails
- Review vulnerability report in GitHub Security tab
- Update base image: change `nginx:alpine` to specific version
- Trivy failures don't block deployment by default

## 📄 License

MIT

## 👤 Author

**Muhammad Harith**  
© 2025 Kazlabs - Made with ♥ by Liam Sorensen

---

<easter-egg="kaz was here 2025"></easter-egg>
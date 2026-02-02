# ---
# The Voices In My Head Media Group - Presentation Demo Script
# Made with a redbull fueled rage by Muhammad Harith
# Version 0.1.0 - 2026-02-02
# ---

<#
.SYNOPSIS
    Automated demo script for Gallery Website presentation
.DESCRIPTION
    Runs all demos in sequence: tests, docker build, docker run, compose, and opens browser
.EXAMPLE
    .\demo-presentation.ps1
#>

param(
    [switch]$SkipTests = $false,
    [switch]$SkipDocker = $false,
    [switch]$CleanupOnly = $false
)

# Color output functions
function Write-Header {
    param([string]$Message)
    Write-Host "`n╭─────────────────────────────────────────────────────────╮" -ForegroundColor Cyan
    Write-Host "│ $Message" -ForegroundColor Cyan
    Write-Host "╰─────────────────────────────────────────────────────────╯`n" -ForegroundColor Cyan
}

function Write-Step {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss')] [DemoScript] [INFO] $Message" -ForegroundColor Green
}

function Write-Error-Log {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss')] [DemoScript] [ERROR] $Message" -ForegroundColor Red
}

function Write-Warning-Log {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-ddTHH:mm:ss')] [DemoScript] [WARN] $Message" -ForegroundColor Yellow
}

# Cleanup function
function Invoke-Cleanup {
    Write-Header "Cleaning up existing containers and images"
    
    Write-Step "Stopping docker-compose services"
    docker-compose down 2>$null
    
    Write-Step "Stopping running gallery containers"
    docker ps -q --filter "name=gallery-website" | ForEach-Object {
        docker stop $_ 2>$null
        docker rm $_ 2>$null
    }
    
    Write-Step "Removing gallery image"
    docker rmi gallery-website:latest -f 2>$null
    
    Write-Step "Cleanup complete"
}

# Main demo script
function Start-Demo {
    Clear-Host
    
    Write-Host @"
╭───────────────────── Gallery Website Demo ─────────────────────╮
│ Welcome to Gallery Website Presentation Demo                   │
│ Running automated demo sequence...                             │
╰──────────── Made with the voices by Muhammad Harith ──────────╯
"@ -ForegroundColor Cyan

    # Verify we're in correct directory
    if (-not (Test-Path ".\Dockerfile")) {
        Write-Error-Log "Dockerfile not found. Are you in the Gallery-website directory?"
        exit 1
    }

    Write-Step "Starting demo sequence at $(Get-Date -Format 'HH:mm:ss')"

    # Step 1: Run Tests
    if (-not $SkipTests) {
        Write-Header "STEP 1: Running Test Suite"
        Write-Step "Executing npm test"
        
        try {
            npm test
            if ($LASTEXITCODE -ne 0) {
                Write-Error-Log "Tests failed with exit code $LASTEXITCODE"
                $continue = Read-Host "Continue anyway? (y/n)"
                if ($continue -ne 'y') { exit 1 }
            } else {
                Write-Step "All tests passed successfully"
            }
        } catch {
            Write-Error-Log "Failed to run tests: $_"
            exit 1
        }
        
        Write-Host "`nPress Enter to continue to Docker build..." -ForegroundColor Yellow
        Read-Host
    }

    # Step 2: Docker Build
    if (-not $SkipDocker) {
        Write-Header "STEP 2: Building Docker Image"
        Write-Step "Building gallery-website:latest"
        
        try {
            docker build -t gallery-website:latest .
            if ($LASTEXITCODE -ne 0) {
                Write-Error-Log "Docker build failed"
                exit 1
            }
            Write-Step "Docker image built successfully"
            
            # Show image info
            Write-Step "Image details:"
            docker images gallery-website:latest
        } catch {
            Write-Error-Log "Failed to build Docker image: $_"
            exit 1
        }
        
        Write-Host "`nPress Enter to continue to Docker run..." -ForegroundColor Yellow
        Read-Host
    }

    # Step 3: Docker Run (single container)
    if (-not $SkipDocker) {
        Write-Header "STEP 3: Running Docker Container"
        Write-Step "Starting container on port 8080"
        
        try {
            docker run -d -p 8080:80 --name gallery-website gallery-website:latest
            if ($LASTEXITCODE -ne 0) {
                Write-Error-Log "Failed to start container"
                exit 1
            }
            
            Write-Step "Waiting 5 seconds for container startup"
            Start-Sleep -Seconds 5
            
            Write-Step "Container status:"
            docker ps | Select-String "gallery-website"
            
            # Test health endpoint
            Write-Step "Testing health endpoint"
            try {
                $health = Invoke-WebRequest -Uri "http://localhost:8080/health" -UseBasicParsing -TimeoutSec 5
                if ($health.StatusCode -eq 200) {
                    Write-Step "Health check passed: $($health.Content)"
                } else {
                    Write-Warning-Log "Health check returned status $($health.StatusCode)"
                }
            } catch {
                Write-Warning-Log "Health check failed: $_"
            }
            
            Write-Step "Container logs:"
            docker logs gallery-website --tail 10
            
        } catch {
            Write-Error-Log "Failed to run container: $_"
            exit 1
        }
        
        Write-Host "`nPress Enter to open browser..." -ForegroundColor Yellow
        Read-Host
        
        # Open browser
        Write-Step "Opening browser to http://localhost:8080"
        Start-Process "http://localhost:8080"
        
        Write-Host "`nDemonstrate the website features:" -ForegroundColor Cyan
        Write-Host "  1. Click images to open lightbox" -ForegroundColor White
        Write-Host "  2. Click Welcome button for modal" -ForegroundColor White
        Write-Host "  3. Show responsive grid (resize window)" -ForegroundColor White
        Write-Host "`nPress Enter to continue to Docker Compose demo..." -ForegroundColor Yellow
        Read-Host
        
        # Stop single container
        Write-Step "Stopping single container"
        docker stop gallery-website 2>$null
        docker rm gallery-website 2>$null
    }

    # Step 4: Docker Compose
    if (-not $SkipDocker) {
        Write-Header "STEP 4: Docker Compose Orchestration"
        Write-Step "Starting services with docker-compose"
        
        try {
            docker-compose up -d
            if ($LASTEXITCODE -ne 0) {
                Write-Error-Log "Docker Compose failed"
                exit 1
            }
            
            Write-Step "Waiting 5 seconds for service startup"
            Start-Sleep -Seconds 5
            
            Write-Step "Service status:"
            docker-compose ps
            
            Write-Step "Service logs (last 15 lines):"
            docker-compose logs --tail 15
            
            # Test again
            Write-Step "Testing application via compose"
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:8080/" -UseBasicParsing -TimeoutSec 5
                if ($response.StatusCode -eq 200) {
                    Write-Step "Application responding successfully"
                }
            } catch {
                Write-Warning-Log "Application test failed: $_"
            }
            
        } catch {
            Write-Error-Log "Docker Compose operation failed: $_"
            exit 1
        }
        
        Write-Host "`nPress Enter to open browser again..." -ForegroundColor Yellow
        Read-Host
        
        Write-Step "Opening browser to http://localhost:8080"
        Start-Process "http://localhost:8080"
    }

    # Step 5: Pipeline Explanation
    Write-Header "STEP 5: CI/CD Pipeline Overview"
    Write-Step "Pipeline configuration location: .github/workflows/ci-cd-pipeline.yml"
    Write-Host @"

Pipeline Jobs:
──────────────
1. TEST         → Runs npm test, validates code
2. BUILD        → Builds Docker image, runs health checks
3. SECURITY     → Scans with Trivy for vulnerabilities
4. REGISTRY     → Pushes to GitHub Container Registry (main/master only)
5. DEPLOY       → Deployment stage (placeholder for production)

Pipeline Features:
─────────────────
• Runs on: push, pull_request, workflow_dispatch
• Node.js version: 18
• Test artifacts: Retained for 7 days
• Security: SARIF results uploaded to GitHub Security
• Tagging: branch name, commit SHA, and 'latest'
• Logging: Structured format with timestamps

"@ -ForegroundColor White

    Write-Step "You can view the full pipeline config with:"
    Write-Host "  Get-Content .github\workflows\ci-cd-pipeline.yml" -ForegroundColor Gray

    Write-Host "`nPress Enter to complete demo..." -ForegroundColor Yellow
    Read-Host

    # Demo complete
    Write-Header "Demo Sequence Complete!"
    
    Write-Host @"
✅ Demo Summary:
   • Tests executed and validated
   • Docker image built successfully
   • Single container demonstrated
   • Docker Compose orchestration shown
   • Pipeline architecture explained
   • Application running at http://localhost:8080

📋 Next Steps:
   • Application is still running via docker-compose
   • Access it at: http://localhost:8080
   • View logs: docker-compose logs -f
   • Stop services: docker-compose down

🎯 Key Points to Emphasize:
   • Automated testing catches issues early
   • Docker ensures consistency across environments
   • Health checks enable monitoring
   • CI/CD pipeline automates entire workflow
   • Security scanning with Trivy

"@ -ForegroundColor Green

    Write-Step "Demo completed at $(Get-Date -Format 'HH:mm:ss')"
    Write-Host "Good luck with your presentation! 🚀" -ForegroundColor Cyan
}

# Script execution
try {
    if ($CleanupOnly) {
        Invoke-Cleanup
        Write-Step "Cleanup complete. Ready for fresh demo."
    } else {
        # Clean up before starting
        Invoke-Cleanup
        Start-Sleep -Seconds 2
        
        # Run demo
        Start-Demo
    }
} catch {
    Write-Error-Log "Demo script failed: $_"
    Write-Error-Log $_.ScriptStackTrace
    exit 1
}

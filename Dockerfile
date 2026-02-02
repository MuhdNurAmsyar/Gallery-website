# ---
# The Voices In My Head Media Group - Gallery Website Dockerfile
# DevOps/Infrastructure Developer: Harith
# Made with a redbull fueled rage by Muhammad Harith
# Version 0.1.0 - 2026-01-26
# ---

# Use nginx alpine because we're not fucking around with bloated images
FROM nginx:alpine
# Specifies base image: nginx web server on Alpine Linux (minimal, ~5MB)
# Alpine is chosen for small image size and security

# Set metadata because we're professional goddamnit
LABEL maintainer="Muhammad Harith <voices@kazlabs.com>"
# Sets maintainer contact information for image metadata
LABEL description="Simple gallery website served with nginx"
# Sets description metadata for the image
LABEL version="0.1.0"
# Sets version number for image tracking

# Remove default nginx garbage
RUN rm -rf /usr/share/nginx/html/*
# Executes shell command to delete default nginx welcome page and files
# Clears the default nginx document root directory

# Copy our beautiful website to nginx's serving directory
COPY index.html /usr/share/nginx/html/
# Copies main HTML file from build context to nginx document root
COPY css_styles.css /usr/share/nginx/html/
# Copies CSS stylesheet file to nginx document root
COPY js_script.js /usr/share/nginx/html/
# Copies JavaScript file to nginx document root
COPY images.json /usr/share/nginx/html/
# Copies JSON image manifest to nginx document root
COPY images/ /usr/share/nginx/html/images/
# Copies entire images directory (with all images) to nginx document root

# Create custom nginx config for proper mime types and caching
RUN echo 'server { \
# Begins multi-line echo command to create nginx server configuration
    listen 80; \
# Configures nginx to listen on port 80 (standard HTTP port)
    server_name localhost; \
# Sets server name to localhost (can be changed for production domains)
    root /usr/share/nginx/html; \
# Sets document root directory where files are served from
    index index.html; \
# Specifies default index file to serve when directory is requested
    \
    # Proper MIME types \
    location ~* \\.(?:jpg|jpeg|gif|png|ico|svg|webp)$ { \
# Location block that matches image file extensions using regex
# ~* means case-insensitive regex match
        expires 7d; \
# Sets cache expiration to 7 days for image files
        add_header Cache-Control "public, immutable"; \
# Adds cache header telling browsers images won't change (immutable)
    } \
# Closes image location block
    \
    location ~* \\.(?:css|js|json)$ { \
# Location block for CSS, JavaScript, and JSON files
        expires 1d; \
# Sets cache expiration to 1 day for code/data files
        add_header Cache-Control "public, must-revalidate"; \
# Adds cache header requiring revalidation after expiry
    } \
# Closes CSS/JS/JSON location block
    \
    # SPA fallback \
    location / { \
# Default location block for all other requests
        try_files $uri $uri/ /index.html; \
# Tries to serve file, then directory, then falls back to index.html
# Enables single-page application (SPA) routing
    } \
# Closes default location block
    \
    # Health check endpoint for orchestrators \
    location /health { \
# Special endpoint for container health checks
        access_log off; \
# Disables access logging for health check requests (reduces noise)
        return 200 "healthy\\n"; \
# Returns HTTP 200 status with "healthy" text
        add_header Content-Type text/plain; \
# Sets response content type to plain text
    } \
# Closes health check location block
}' > /etc/nginx/conf.d/default.conf
# Writes the entire server block to nginx default configuration file

# Expose port 80 because that's what web servers do
EXPOSE 80
# Documents that container listens on port 80
# Note: This is documentation only, doesn't actually publish the port

# Health check because we're not barbarians
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
# Configures Docker healthcheck with timing parameters:
# - interval: Runs check every 30 seconds
# - timeout: Fails if check takes longer than 3 seconds
# - start-period: Gives container 5 seconds to start before checking
# - retries: Marks unhealthy after 3 consecutive failures
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1
# Health check command: uses wget to test /health endpoint
# --quiet: Suppresses output
# --tries=1: Only attempts once
# --spider: Doesn't download, just checks if URL exists
# || exit 1: Returns error code 1 if wget fails

# Run nginx in foreground (daemon off)
CMD ["nginx", "-g", "daemon off;"]
# Sets container's main process to nginx in foreground mode
# -g "daemon off;" prevents nginx from backgrounding (required for Docker)
# This must be the last instruction in Dockerfile

# ---
# The Voices In My Head Media Group - Gallery Website Dockerfile
# DevOps/Infrastructure Developer: Harith
# Made with a redbull fueled rage by Muhammad Harith
# Version 0.1.0 - 2026-01-26
# ---

# Use nginx alpine because we're not fucking around with bloated images
FROM nginx:alpine

# Set metadata because we're professional goddamnit
LABEL maintainer="Muhammad Harith <voices@kazlabs.com>"
LABEL description="Simple gallery website served with nginx"
LABEL version="0.1.0"

# Remove default nginx garbage
RUN rm -rf /usr/share/nginx/html/*

# Copy our beautiful website to nginx's serving directory
COPY index.html /usr/share/nginx/html/
COPY css_styles.css /usr/share/nginx/html/
COPY js_script.js /usr/share/nginx/html/
COPY images.json /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/

# Create custom nginx config for proper mime types and caching
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Proper MIME types \
    location ~* \\.(?:jpg|jpeg|gif|png|ico|svg|webp)$ { \
        expires 7d; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    location ~* \\.(?:css|js|json)$ { \
        expires 1d; \
        add_header Cache-Control "public, must-revalidate"; \
    } \
    \
    # SPA fallback \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Health check endpoint for orchestrators \
    location /health { \
        access_log off; \
        return 200 "healthy\\n"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80 because that's what web servers do
EXPOSE 80

# Health check because we're not barbarians
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Run nginx in foreground (daemon off)
CMD ["nginx", "-g", "daemon off;"]

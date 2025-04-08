# Use Node.js LTS as base image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies with security considerations
# Use legacy peer deps as mentioned in security report
RUN npm ci --legacy-peer-deps

# Copy all files
COPY . .

# Build the application
RUN npm run build

# Production stage with nginx for serving static files
FROM nginx:stable-alpine AS production

# Copy built files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -q --spider http://localhost || exit 1

# Command to run nginx
CMD ["nginx", "-g", "daemon off;"]
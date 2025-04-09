# Use Node.js LTS as base image
FROM node:20-slim AS build
# Set environment variables
ENV NODE_ENV=production

# Update packages and install security updates
RUN apt-get update && apt-get upgrade -y && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Add labels for maintainability
LABEL maintainer="LTHT" \
    description="Mock API for Patient Management App"
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
RUN npm audit fix || true

# Copy app source
COPY server.js ./
# Distroless images run as non-root by default
# No need to create user explicitly

# Expose API port
EXPOSE 3001

# Second stage - using a secure minimal runtime image
FROM cgr.dev/chainguard/node:latest
WORKDIR /usr/src/app

# Copy from build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/server.js ./

# Expose API port
EXPOSE 3001

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:3001/health || exit 1

# Start application
CMD ["node", "server.js"]
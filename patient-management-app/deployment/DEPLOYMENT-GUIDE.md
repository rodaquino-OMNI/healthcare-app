# Patient Management Application - Testing Environment Deployment Guide

This guide provides instructions for deploying the Patient Management Application to a secure testing environment that mirrors production conditions.

## Overview

The testing environment consists of:

1. **Frontend Container** - A containerized version of the React application served via Nginx
2. **Mock API Container** - A simulated backend API that provides test data and authentication

These containers are orchestrated using Docker Compose to create an isolated testing environment.

## Prerequisites

- Docker and Docker Compose (version 1.28.0+)
- Git
- Node.js 14+ and npm (for local development only)

## Security Features

This testing environment implements the following security measures:

- **HTTPS-ready configuration** in Nginx
- **Content Security Policy (CSP)** to prevent XSS attacks
- **JWT-based authentication** with proper token handling
- **Helmet** middleware for the API with secure HTTP headers
- **Non-root user** execution in containers
- **Health checks** for both containers
- **Regular security updates** as specified in the security report

## Deployment Steps

### 1. Clone the Repository (if not already done)

```bash
git clone <repository-url>
cd patient-management-app
```

### 2. Configure Environment Variables

The environment variables are pre-configured in the `.env.testing` file. For custom configuration:

```bash
# Copy the sample file and edit as needed
cp .env.testing .env.custom
```

### 3. Build and Start the Services

```bash
# Start the environment with default configuration
docker-compose up -d

# OR use a custom environment file
docker-compose --env-file .env.custom up -d
```

### 4. Verify the Deployment

The frontend application should be accessible at:
- **URL**: http://localhost:8080

The mock API service should be accessible at:
- **URL**: http://localhost:3001
- **Health Endpoint**: http://localhost:3001/health

### 5. Login to the Application

Use one of the following test accounts:

| Role     | Username             | Password     |
|----------|----------------------|--------------|
| Doctor   | doctor@example.com   | password123  |
| Nurse    | nurse@example.com    | password123  |
| Admin    | admin@example.com    | password123  |

## Testing the Environment

### Smoke Tests

1. **Authentication Flow**:
   - Visit http://localhost:8080
   - Log in with test credentials
   - Verify you can access protected routes
   - Test logging out

2. **Patient Management**:
   - View the patient list
   - View details for individual patients
   - Test search functionality

3. **Appointments**:
   - View scheduled appointments
   - Check appointment details

4. **Medications**:
   - View patient medications
   - Check medication details

### Environment Verification

The following commands can help verify that the environment is running correctly:

```bash
# Check if containers are running
docker-compose ps

# View container logs
docker-compose logs -f frontend
docker-compose logs -f api

# Check the health status
curl http://localhost:3001/health
```

## Troubleshooting

### Common Issues

1. **Container fails to start**:
   - Check container logs: `docker-compose logs frontend` or `docker-compose logs api`
   - Verify port availability: Make sure ports 8080 and 3001 are not in use
   - Ensure Docker has sufficient resources allocated

2. **Cannot connect to API**:
   - Verify the API container is running: `docker-compose ps`
   - Check the API health endpoint: `curl http://localhost:3001/health`
   - Inspect network settings: `docker network inspect patient-app-network`

3. **Authentication issues**:
   - Verify correct credentials are being used
   - Check browser console for JWT-related errors
   - Inspect API logs: `docker-compose logs api`

### Restarting Services

```bash
# Restart a specific service
docker-compose restart frontend
docker-compose restart api

# Rebuild and restart all services
docker-compose down
docker-compose up -d --build
```

## Security Considerations

1. **Sensitive Data**: The testing environment contains mock data only. Never use real patient data in testing.

2. **Network Access**: The testing environment exposes ports on localhost only. For remote testing, consider using a VPN or SSH tunneling.

3. **Authentication**: Test credentials should never match production credentials.

4. **JWT Secret**: The JWT secret is for testing only. Production environments should use a strong, unique secret.

## Production Readiness

This testing environment mirrors production in the following ways:

1. **Container-based deployment**: Same containerization approach as production
2. **Nginx configuration**: Same security headers and routing rules
3. **Authentication flow**: Same JWT mechanism used in production
4. **API structure**: APIs follow the same RESTful patterns

Key differences from production:

1. **Mock data**: Test data instead of real patient records
2. **Simplified infrastructure**: No load balancers, redundancy, or auto-scaling
3. **Local network**: No external domain or TLS certificates
4. **Monitoring**: Limited monitoring and logging compared to production

## Stopping the Environment

```bash
# Stop the environment but preserve data
docker-compose stop

# Stop and remove containers, networks, and volumes
docker-compose down
```

## Applying Updates

To update the environment with the latest code:

```bash
git pull
docker-compose down
docker-compose up -d --build
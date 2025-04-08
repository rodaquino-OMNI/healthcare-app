 #!/bin/bash
#
# Patient Management Application - Test Environment Deployment Script
# 
# This script automates the deployment of the secure testing environment
# for the Patient Management Application.

set -e

# Color setup for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Banner
echo -e "${GREEN}"
echo "┌──────────────────────────────────────────────────────┐"
echo "│  PATIENT MANAGEMENT APPLICATION - TEST ENVIRONMENT   │"
echo "│           SECURE DEPLOYMENT SCRIPT                   │"
echo "└──────────────────────────────────────────────────────┘"
echo -e "${NC}"

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker not found. Please install Docker and try again.${NC}"
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose not found. Please install Docker Compose and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}All prerequisites are met.${NC}"

# Verify Docker is running
echo -e "${YELLOW}Verifying Docker service...${NC}"
if ! docker info &>/dev/null; then
    echo -e "${RED}Docker service is not running. Please start Docker and try again.${NC}"
    exit 1
fi
echo -e "${GREEN}Docker service is running.${NC}"

# Check for existing containers and prompt to remove them
if docker ps -a | grep -q "patient-app"; then
    echo -e "${YELLOW}Existing patient-app containers detected.${NC}"
    read -p "Do you want to remove existing containers? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Removing existing containers...${NC}"
        docker-compose down
    fi
fi

# Perform security checks before deployment
echo -e "${YELLOW}Performing security checks...${NC}"

# 1. Check if ports are already in use
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}Port 8080 is already in use. Please free this port before proceeding.${NC}"
    exit 1
fi

if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}Port 3001 is already in use. Please free this port before proceeding.${NC}"
    exit 1
fi

# 2. Verify Docker network security
echo -e "${YELLOW}Checking Docker network isolation...${NC}"
if docker network ls | grep -q "patient-app-network"; then
    echo -e "${YELLOW}Removing existing patient-app-network...${NC}"
    docker network rm patient-app-network || true
fi

# 3. Verify .env file exists
if [ ! -f .env.testing ]; then
    echo -e "${RED}.env.testing file not found. Creating default configuration...${NC}"
    cat > .env.testing << EOL
# Patient Management App - Testing Environment

# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3001
REACT_APP_USE_MOCK=false

# Authentication Settings
JWT_SECRET=test-environment-jwt-secret
TOKEN_EXPIRY=3600

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_NOTIFICATIONS=true

# Logging
REACT_APP_LOG_LEVEL=info
EOL
    echo -e "${GREEN}.env.testing file created with default values.${NC}"
fi

# Build and deploy the containers
echo -e "${YELLOW}Building and deploying containers...${NC}"

# Ensure the deployment directory exists
if [ ! -d "deployment" ]; then
    echo -e "${RED}Deployment directory not found. Please run this script from the patient-management-app directory.${NC}"
    exit 1
fi

# Copy .env.testing to .env for deployment
cp .env.testing .env

# Build and start containers
echo -e "${YELLOW}Starting Docker Compose...${NC}"
docker-compose up -d --build

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to start...${NC}"
echo -e "This may take a few moments..."

# Function to check if a service is healthy
check_health() {
    local service=$1
    local endpoint=$2
    local max_attempts=30
    local wait_seconds=2
    
    echo -e "${YELLOW}Checking health of $service at $endpoint...${NC}"
    
    for ((i=1; i<=max_attempts; i++)); do
        if curl -s -f "$endpoint" &>/dev/null; then
            echo -e "${GREEN}$service is healthy!${NC}"
            return 0
        fi
        echo -n "."
        sleep $wait_seconds
    done
    
    echo -e "\n${RED}$service is not responding after $(($max_attempts * $wait_seconds)) seconds.${NC}"
    return 1
}

# Check API health
if ! check_health "API service" "http://localhost:3001/health"; then
    echo -e "${RED}API service failed to start properly. Check logs with 'docker-compose logs api'${NC}"
    exit 1
fi

# Check frontend
if ! check_health "Frontend application" "http://localhost:8080"; then
    echo -e "${RED}Frontend application failed to start properly. Check logs with 'docker-compose logs frontend'${NC}"
    exit 1
fi

# Display success message and access information
echo -e "\n${GREEN}=======================================================${NC}"
echo -e "${GREEN}      TEST ENVIRONMENT SUCCESSFULLY DEPLOYED!${NC}"
echo -e "${GREEN}=======================================================${NC}"
echo -e ""
echo -e "  Frontend: http://localhost:8080"
echo -e "  API:      http://localhost:3001"
echo -e ""
echo -e "  Test Users:"
echo -e "    - Doctor: doctor@example.com / password123"
echo -e "    - Nurse:  nurse@example.com / password123"
echo -e "    - Admin:  admin@example.com / password123"
echo -e ""
echo -e "${YELLOW}For more details, see deployment/DEPLOYMENT-GUIDE.md${NC}"
echo -e ""
echo -e "${GREEN}To stop the environment:${NC} docker-compose down"
echo -e ""

# Display logs option
read -p "Do you want to view the logs? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose logs -f
fi

exit 0
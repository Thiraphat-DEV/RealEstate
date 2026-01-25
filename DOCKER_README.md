# Docker Setup Guide

## Overview
This project includes Docker configuration to run both frontend and backend services together, along with MongoDB and other supporting services.

## Services

- **Frontend**: React/Vite application served via Nginx (port 3000)
- **Backend**: NestJS API server (port 5000)
- **MongoDB**: Database server (port 27017)
- **Mongo Express**: MongoDB admin interface (port 8081)
- **Keycloak**: Authentication server (port 8080)

## Quick Start

### Build and Run All Services

```bash
docker-compose up --build
```

This will:
1. Build Docker images for frontend and backend
2. Start MongoDB and wait for it to be ready
3. Run the import script (`import-mockup-data.ts`) in the backend container
4. Start the backend server
5. Start the frontend server
6. Start all supporting services

### Run in Background

```bash
docker-compose up -d --build
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop Services

```bash
docker-compose down
```

### Stop and Remove Volumes

```bash
docker-compose down -v
```

## Backend Import Script

The backend automatically runs the `import-mockup-data.ts` script on startup. This script:
- Imports master data (cities, property types, statuses, addresses)
- Imports property data
- Skips existing data (idempotent)

If the script fails or data already exists, the backend server will still start.

## Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Swagger Docs**: http://localhost:5000/api/docs
- **Mongo Express**: http://localhost:8081 (admin/admin)
- **Keycloak**: http://localhost:8080 (admin/admin)

## Environment Variables

### Backend
- `PORT`: Server port (default: 5000)
- `DB_HOST`: MongoDB host (default: mongodb)
- `DB_PORT`: MongoDB port (default: 27017)
- `DB_USERNAME`: MongoDB username (default: admin)
- `DB_PASSWORD`: MongoDB password (default: realestate_password)
- `DB_NAME`: Database name (default: realestate)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:3000)

## Troubleshooting

### Backend won't start
- Check MongoDB is healthy: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`
- Verify MongoDB connection string in environment variables

### Import script fails
- Check MongoDB is accessible from backend container
- Verify mockup-data files exist in backend/mockup-data/
- Check backend logs for specific error messages

### Frontend can't connect to backend
- Verify backend is running: `docker-compose ps`
- Check CORS settings in backend/src/main.ts
- Verify FRONTEND_URL environment variable

## Development

For development, you may want to mount volumes for hot-reload:

```yaml
# Add to docker-compose.yaml services
volumes:
  - ./backend/src:/app/src
  - ./frontend/src:/app/src
```

## Production Considerations

- Use environment-specific .env files
- Configure proper CORS origins
- Set up SSL/TLS certificates
- Use secrets management for sensitive data
- Configure proper resource limits
- Set up monitoring and logging

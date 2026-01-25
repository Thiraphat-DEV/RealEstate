# Backend Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY scripts ./scripts
COPY mockup-data ./mockup-data

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev dependencies for ts-node)
RUN npm ci && npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/mockup-data ./mockup-data

# Create entrypoint script
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'echo "Waiting for MongoDB to be ready..."' >> /app/entrypoint.sh && \
    echo 'until nc -z ${DB_HOST:-mongodb} ${DB_PORT:-27017}; do' >> /app/entrypoint.sh && \
    echo '  echo "MongoDB is unavailable - sleeping"' >> /app/entrypoint.sh && \
    echo '  sleep 2' >> /app/entrypoint.sh && \
    echo 'done' >> /app/entrypoint.sh && \
    echo 'echo "MongoDB is up - executing import script..."' >> /app/entrypoint.sh && \
    echo 'npm run import:mockup || echo "⚠️  Import script failed or data already exists - continuing..."' >> /app/entrypoint.sh && \
    echo 'echo "Starting backend server..."' >> /app/entrypoint.sh && \
    echo 'exec npm run start:prod' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# Install netcat for health check
RUN apk add --no-cache netcat-openbsd

EXPOSE 5000

CMD ["/app/entrypoint.sh"]

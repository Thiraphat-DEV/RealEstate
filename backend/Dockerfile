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
RUN echo "=== Starting build ===" && \
    npm run build && \
    echo "=== Build completed, checking output ===" && \
    echo "=== All files in dist ===" && \
    find dist -type f | head -30 && \
    echo "=== All directories in dist ===" && \
    find dist -type d && \
    echo "=== JavaScript files in dist ===" && \
    find dist -type f -name "*.js" && \
    echo "=== Checking for main.js ===" && \
    if [ -f dist/main.js ]; then \
        echo "✓ Found dist/main.js"; \
    elif [ -f dist/src/main.js ]; then \
        echo "✓ Found dist/src/main.js"; \
    else \
        echo "✗ ERROR: main.js not found!"; \
        echo "Dist contents:"; \
        ls -laR dist/ | head -50; \
        exit 1; \
    fi

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

# Verify dist directory exists and main.js is present
RUN echo "=== Verifying dist structure ===" && \
    ls -la /app/dist && \
    echo "=== Searching for main.js ===" && \
    MAIN_FILE="" && \
    if [ -f /app/dist/main.js ]; then \
        MAIN_FILE="/app/dist/main.js"; \
        echo "✓ Found main.js at: $MAIN_FILE"; \
    elif [ -f /app/dist/src/main.js ]; then \
        MAIN_FILE="/app/dist/src/main.js"; \
        echo "✓ Found main.js at: $MAIN_FILE"; \
        echo "Moving to expected location..."; \
        cp /app/dist/src/main.js /app/dist/main.js; \
    else \
        echo "✗ ERROR: main.js not found in expected locations!"; \
        echo "All files in dist:"; \
        find /app/dist -type f | head -30; \
        echo "All directories in dist:"; \
        find /app/dist -type d; \
        exit 1; \
    fi && \
    echo "=== Verification successful ===" && \
    ls -lh /app/dist/main.js

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

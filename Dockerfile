# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only (no build tools needed for this package)
RUN npm ci --only=production --ignore-scripts

# Copy application source
COPY src/ ./src/
COPY config/ ./config/

# Expose the server port
EXPOSE 80

# Set NODE_ENV to production
ENV NODE_ENV=production
ENV PORT=80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:80/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); });"

# Run the application
CMD ["node", "src/index.js"]

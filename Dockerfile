# Use Node.js 22 LTS as base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S sumo-cli -u 1001

# Create directories for data storage
RUN mkdir -p /home/sumo-cli/.sumo-cli/json /home/sumo-cli/.sumo-cli/cache /home/sumo-cli/.sumo-cli/logs
RUN chown -R sumo-cli:nodejs /home/sumo-cli/.sumo-cli

# Switch to non-root user
USER sumo-cli

# Set environment variables
ENV NODE_ENV=production
ENV HOME=/home/sumo-cli

# Expose port (if needed for future web interface)
EXPOSE 3000

# Set the entrypoint
ENTRYPOINT ["node", "dist/index.js"]

# Default command
CMD ["--help"]

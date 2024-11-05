# Stage 1: Builder
FROM node:21.7.1 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the application code
COPY . .

# Build the application if needed (optional, remove if not applicable)
# RUN npm run build

# Stage 2: Production Image
FROM node:21.7.1 AS production

# Set the working directory
WORKDIR /app

# Copy built files and dependencies from the builder stage
COPY --from=builder /app .

# Expose the API port
EXPOSE 5001

# Start the application
CMD ["node", "server.js"]

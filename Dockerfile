# # # Stage 1: Build
# # FROM node:21.7.1 AS builder

# # # Set the working directory
# # WORKDIR /app

# # # Copy package.json and package-lock.json
# # COPY package*.json ./

# # # Install production dependencies only
# # RUN npm ci --only=production

# # # Copy the application code
# # COPY . .

# # # Stage 2: Production Image
# # FROM node:21.7.1 AS production

# # # Set the working directory
# # WORKDIR /app

# # # Copy necessary files from the builder stage
# # COPY --from=builder /app .

# # # Expose the API port
# # EXPOSE 5001

# # # Start the application
# # CMD ["node", "server.js"]
# # Stage 1: Builder
# FROM node:21.7.1 AS builder

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json for dependency installation
# COPY package*.json ./

# # Install production dependencies
# RUN npm ci --only=production

# # Copy the rest of the application code to the builder
# COPY . .

# # Stage 2: Production Image
# FROM node:21.7.1 AS production

# # Set the working directory in the final image
# WORKDIR /app

# # Copy only the necessary files from the builder stage
# COPY --from=builder /app .

# # Expose the desired port (5001 in this case)
# EXPOSE 5001

# # Define the command to run the application
# CMD ["node", "server.js"]
# Stage 1: Build
FROM node:21.7.1 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the application code
COPY . .

# Delete node_modules to reinstall with Linux binaries
RUN rm -rf node_modules && npm ci --only=production

# Stage 2: Production Image
FROM node:21.7.1 AS production

# Set the working directory
WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app . 

# Expose the API port
EXPOSE 5001

# Start the application
CMD ["node", "server.js"]

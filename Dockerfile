
# FROM node:21.7.1 AS builder

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json files
# COPY package*.json ./

# # Install dependencies (this will install bcrypt for the correct OS)
# RUN npm ci

# # Copy the application code
# COPY . .

# # Remove development dependencies if needed (optional)
# RUN npm prune --production

# # Stage 2: Production Image
# FROM node:21.7.1 AS production

# # Set the working directory
# WORKDIR /app

# # Copy only the necessary files from the builder stage
# COPY --from=builder /app . 

# # Expose the application port
# EXPOSE 5001

# # Start the application
# CMD ["node", "server.js"]
# Stage 1: Build Stage
# FROM node:21.7.1 AS builder

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json files
# COPY package*.json ./

# # Install dependencies
# RUN npm ci

# # Copy the application code
# COPY . .

# # Remove development dependencies (optional, only if needed)
# RUN npm prune --production

# # Stage 2: Production Stage
# FROM node:21.7.1 AS production

# # Set the working directory
# WORKDIR /app

# # Copy only the necessary files from the builder stage
# COPY --from=builder /app ./

# # Expose the application port
# EXPOSE 5001

# # Start the application
# CMD ["node", "server.js"]
# Use the official Node.js image as the base image
FROM node:21.7.1 AS builder

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 5001

# Start the application
CMD ["node", "server.js"]

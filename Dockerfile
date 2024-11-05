
FROM node:21.7.1 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies (this will install bcrypt for the correct OS)
RUN npm ci

# Copy the application code
COPY . .

# Remove development dependencies if needed (optional)
RUN npm prune --production

# Stage 2: Production Image
FROM node:21.7.1 AS production

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app . 

# Expose the application port
EXPOSE 5001

# Start the application
CMD ["node", "server.js"]

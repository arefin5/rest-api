# Use the official Mongo Express image from Docker Hub
FROM mongo-express:latest

# Set environment variables (you can override these in docker-compose.yml)
ENV ME_CONFIG_MONGODB_ADMINUSERNAME=testuser
ENV ME_CONFIG_MONGODB_ADMINPASSWORD=testpassword
ENV ME_CONFIG_MONGODB_SERVER=mongodb

# Expose the Mongo Express port
EXPOSE 8081

# Default command
CMD ["mongo-express"]

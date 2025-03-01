# Use the official Node.js Alpine base image
FROM node:alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application files
COPY . .

# Expose port 80
EXPOSE 80

# Set environment variable to use port 80
ENV PORT=80

# Command to run the application
CMD ["node", "server.js"]
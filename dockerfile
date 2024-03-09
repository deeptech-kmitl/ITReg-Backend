# Use Node.js image as base
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to container
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the entire application to container
COPY . .

# Expose port 5000
EXPOSE 3001

# Command to run the Express server
CMD ["node", "server.js"]
# Use official Node.js version 20.18.0 image as the base
FROM node:20.18.0

# Set working directory
WORKDIR /app/backend

# Expose 8080 port for Cloud Run
EXPOSE 8080

# Copy package.json and package-lock.json, then install dependencies
#COPY package.json package-lock.json ./
RUN npm install

# Copy the remaining backend code
COPY . .

# Command to start the backend server with env file setup
CMD ["node", "--env-file=.env", "src/index.js"]
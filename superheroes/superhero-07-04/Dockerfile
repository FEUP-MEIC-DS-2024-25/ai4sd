FROM node:18-alpine

# Set a directory for the app and change to it
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm install --verbose

# Copy all the files to the container
COPY . .

# Ensure tsconfig.json is copied
COPY tsconfig.json ./

# Build the TypeScript code
RUN npm run build

# Expose the port the server will run on
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
FROM node:18-alpine

# Set a directory for the app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm install


# Copy the gemini key from google environment variable
RUN echo 'GEMINI_API_KEY=$(superhero-05-03-secret)' > .env

# Copy all the files to the container
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port the server will run on
EXPOSE 8080

# Start the server
CMD ["npm", "start"]

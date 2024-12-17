# Base image
FROM node:22

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the gemini key from google environment variable
RUN echo 'GEMINI_API_KEY=$(superhero-02-04-secret)' > .env

# Copy the rest of the application code
COPY . .

# Expose the backend port
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]
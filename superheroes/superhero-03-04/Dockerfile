FROM node:18-bullseye

WORKDIR /app

# Install system dependencies for building native modules
RUN apt-get update && apt-get install -y build-essential

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm cache clean --force && npm install --verbose

# Copy the rest of the application files
COPY . .

EXPOSE 3000
CMD ["npm", "start"]

FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies, including devDependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Install Vite globally to ensure it is available during runtime
RUN npm install -g vite

# Start the development server
CMD ["npx", "vite", "--host"]

# Expose the port for the development server
EXPOSE 5173


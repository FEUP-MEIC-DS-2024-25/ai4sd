FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to install dependencies
COPY package*.json ./

RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the port that the app will run on
EXPOSE 8080

# Accept the service account key as a build argument
ARG SERVICE_ACCOUNT_KEY

# Write the service account key to a file
RUN echo "$SERVICE_ACCOUNT_KEY" > /usr/src/app/service_account_key.json

# Set the correct ownership and permissions for the service account key
RUN chmod 600 /usr/src/app/service_account_key.json && chown node:node /usr/src/app/service_account_key.json

# Set the environment variable for Firebase credentials
ENV GOOGLE_APPLICATION_CREDENTIALS=/usr/src/app/service_account_key.json

# Switch to a non-root user for security
USER node

# Start the application
CMD ["npm", "run", "dev"]

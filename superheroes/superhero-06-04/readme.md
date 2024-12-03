**All files placed in the first commit of this branch are only moving from the team's public repository to the main "ai4sd" repository.**

- The adaptations to make this work with the new architecture are not complete yet.

### OLD PROTOTYPE SETUP - DOCKERFILE THAT WAS USED FOR BACKEND

```
# Use official Node.js version 20.18.0 image as the base
#FROM node:20.18.0

# Set working directory
#WORKDIR /app/backend

# Expose the backend port
#EXPOSE 3000

# Copy package.json and package-lock.json, then install dependencies
#COPY package.json package-lock.json ./
#RUN npm install

# Copy the remaining backend code
#COPY . .

# Command to start the backend server with env file setup
#CMD ["node", "--env-file=.env", "src/index.js"]
```

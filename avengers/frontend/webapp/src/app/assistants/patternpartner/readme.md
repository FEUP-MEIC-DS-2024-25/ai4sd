**All files placed in the first commit of this branch are only moving from the team's public repository to the main "ai4sd" repository.**

- The adaptations to make this work with the new architecture are not complete yet.
- To test, from the root of the project simply navigate to `avengers/frontend/webapp` and run `docker-compose up`, then access: `http://localhost:3000/assistants/patternpartner`.

### OLD PROTOTYPE SETUP - DOCKERFILE THAT WAS USED FOR FRONTEND

```
# Use official Node.js version 20.18.0 image as the base
FROM node:20.18.0

# Set working directory
WORKDIR /app/frontend

# Expose the frontend port
EXPOSE 3002

# Copy package.json and package-lock.json, then install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the React app for production
RUN npm run build

# Use the locally installed 'serve' to serve the built app
CMD ["npm", "run", "serve"]
```

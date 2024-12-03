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

CMD ["npm", "run", "dev"]

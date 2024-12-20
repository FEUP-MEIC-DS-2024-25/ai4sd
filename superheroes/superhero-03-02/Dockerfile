# Node.js Image
FROM node:18

# Working directory
WORKDIR /app

# Copiar os ficheiros de configuração das dependências
COPY package*.json ./

# Install the dependencies
RUN npm install

# Put the secret into the file /etc/secrets/.env in our container.
RUN --mount=type=secret,id=superhero-03-02-secret \
 cat /run/secrets/superhero-03-02-secret > /etc/gemini_token

# Copy files to the container
COPY . .

# Environment
ENV NODE_ENV=production


# Expose port
EXPOSE 8080

# start app commands
CMD ["node", "app.js"]

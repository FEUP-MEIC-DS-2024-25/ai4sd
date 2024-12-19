FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

#Install Firebase Admin
RUN npm install --save -g firebase-admin

RUN npm install

COPY . .

# Inject secret and create .env file during build
RUN --mount=type=secret,id=secret \
    echo "GEMINI_API_KEY=$(cat /run/secrets/secret)" > .env && \
    echo "Secret GEMINI_API_KEY injected into .env file."

EXPOSE 8080

CMD ["npm", "start"] 


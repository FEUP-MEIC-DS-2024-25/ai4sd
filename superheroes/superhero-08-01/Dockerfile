FROM node:21-alpine3.19 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g nodemon

CMD ["npm", "start"]

FROM node:21-alpine3.19 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN --mount=type=secret,id=apikey \
    if [ -f /run/secrets/apikey ]; then \
        ENV_CONTENT=$(cat /run/secrets/apikey) && \
        echo -e "PROD=0\nPORT=3200\nGEMINI_API_KEY=${ENV_CONTENT}" > .env; \
    fi

COPY . .

RUN npm install -g nodemon

CMD ["npm", "start"]

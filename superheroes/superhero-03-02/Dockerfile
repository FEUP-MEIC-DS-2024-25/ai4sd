# Usar uma imagem base oficial do Node.js
FROM node:18

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar os ficheiros de configuração das dependências
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Put the secret into the file /etc/secrets/.env in our container.
RUN --mount=type=secret,id=superhero-03-02-secret \
 cat /run/secrets/superhero-03-02-secret > /etc/gemini_token

# Copiar todos os ficheiros do projeto para o container
COPY . .

# Especificar o ambiente como produção
ENV NODE_ENV=production


# Expor a porta usada pela aplicação
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["node", "app.js"]

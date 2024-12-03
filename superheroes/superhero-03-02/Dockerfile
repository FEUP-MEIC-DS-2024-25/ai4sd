# Usar uma imagem base oficial do Node.js
FROM node:18

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar os ficheiros de configuração das dependências
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar todos os ficheiros do projeto para o container
COPY . .

# Especificar o ambiente como produção
ENV NODE_ENV=production

# Expor a porta usada pela aplicação
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["node", "app.js"]

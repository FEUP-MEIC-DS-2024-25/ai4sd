# Use uma imagem base com suporte para múltiplas linguagens
FROM ubuntu:22.04

# Atualize o sistema e instale dependências essenciais
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    openjdk-11-jdk \
    git \
    curl \
    lsb-release \
    && apt-get clean

# Adicionar o repositório do Node.js para a versão desejada (exemplo: 18.x)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

# Instalar o Node.js e npm
RUN apt-get install -y nodejs

# Confirmar que a versão correta do Node.js foi instalada
RUN node -v && npm -v

# Instale o Mutmut globalmente
RUN pip3 install --no-cache-dir MutPy
RUN pip3 install --no-cache-dir google-generativeai

# Defina o diretório de trabalho no container
WORKDIR /app

# Copie todos os arquivos do projeto para o container
COPY . .

# Ajuste permissões para os scripts bash (se necessário)
RUN chmod +x *.sh

WORKDIR /app/frontend
RUN npm install

# Exponha portas necessárias (se tiver serviços web ou APIs)
EXPOSE 8080

# Comando padrão para iniciar o container
CMD ["node", "server.js"]

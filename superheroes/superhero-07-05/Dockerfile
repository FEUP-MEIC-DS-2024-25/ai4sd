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

# Atualizar o npm para a última versão estável
RUN npm install -g npm@latest

# Instale o Mutmut globalmente
RUN pip3 install --no-cache-dir MutPy
RUN pip3 install --no-cache-dir google-generativeai

# Defina o diretório de trabalho no container
WORKDIR /app

# Copie todos os arquivos do projeto para o container
COPY . .

# Instale dependências do Node.js (JavaScript e backend)
RUN npm install --prefix javascript
RUN npm install --prefix back_end_bd

# Instale Jest e Stryker globalmente
RUN npm install -g jest
RUN npm install -g stryker-cli

# Adicionar JUnit ao projeto
RUN curl -O https://repo1.maven.org/maven2/org/junit/platform/junit-platform-console-standalone/1.9.3/junit-platform-console-standalone-1.9.3.jar \
    && mv junit-platform-console-standalone-1.9.3.jar /usr/local/lib/

# Compilar o código Java com o JUnit no classpath
RUN javac -cp /usr/local/lib/junit-platform-console-standalone-1.9.3.jar java/*.java

# Ajuste permissões para os scripts bash (se necessário)
RUN chmod +x *.sh

# Exponha portas necessárias (se tiver serviços web ou APIs)
EXPOSE 3000

# Comando padrão para iniciar o container
CMD ["bash"]

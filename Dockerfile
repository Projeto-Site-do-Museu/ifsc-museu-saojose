# Use a imagem base do Node.js
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia o package.json e o package-lock.json
COPY package.json package-lock.json* ./

# Instala as dependências
RUN npm install --omit=optional --no-optional

# Copia o restante do código da aplicação
COPY . .

# Define variáveis de ambiente
ENV NODE_ENV=production

# Constrói a aplicação
RUN npm run build

# Expõe a porta da aplicação
EXPOSE 3000

# Inicia a aplicação
CMD ["npm", "run", "start"]

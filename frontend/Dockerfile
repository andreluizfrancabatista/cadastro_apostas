FROM node:18-alpine as build

# Definir diretório de trabalho
WORKDIR /app

# Copiar apenas package.json primeiro
COPY package.json ./

# Instalar dependências usando npm install (não npm ci)
RUN npm install

# Copiar resto dos arquivos
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção com nginx
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta
EXPOSE 80

# Comando do nginx
CMD ["nginx", "-g", "daemon off;"]
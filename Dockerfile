# --------------------
# Étape 1 : Build Angular
# --------------------
FROM node:18-alpine AS build
WORKDIR /app

# Copier uniquement package.json pour profiter du cache
COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN npm install -g @angular/cli

# Copier le reste du code
COPY . .
RUN npm run build

# --------------------
# Étape 2 : Servir avec Nginx
# --------------------
FROM nginx:1.25-alpine
COPY --from=build /app/dist/tabarico-front/browser /usr/share/nginx/html

# Configuration Nginx pour Angular + proxy API
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

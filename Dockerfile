# Stage 1: Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package lockfiles first to leverage Docker caching layers
COPY package*.json ./

# Install packages cleanly
RUN npm ci

# Copy the rest of the application files
COPY . .

# Run production compilation build
RUN npm run build

# Stage 2: Production serving stage
FROM nginx:alpine

# Copy custom Nginx configuration to support SPA routing (pushState history fallback) and caching/gzip
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static web assets from stage 1 to Nginx default folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

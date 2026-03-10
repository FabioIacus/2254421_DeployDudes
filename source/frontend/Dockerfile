# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package descriptors and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
# Copy built files to Nginx serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Update Nginx to listen on port 3000 instead of 80 to match docker-compose
RUN sed -i 's/80/3000/g' /etc/nginx/conf.d/default.conf

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]

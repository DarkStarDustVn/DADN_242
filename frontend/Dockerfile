# 1. Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Copy package và cài dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ code và build Vite
COPY . .
RUN npm run build

# 2. Runtime stage: serve bằng nginx
FROM nginx:alpine

# Copy build output sang nginx public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Nếu bạn dùng route trong React (react-router-dom), cần cấu hình nginx:
# Gợi ý file nginx.conf nếu cần:
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

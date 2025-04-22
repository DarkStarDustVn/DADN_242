# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json và package-lock.json nếu có
COPY package*.json ./

# Cài đặt production dependencies
RUN npm install --production

# Copy toàn bộ source code
COPY . .

# Expose port, đọc từ env nhưng default là 8000
EXPOSE 8000

# Start app bằng node (tránh dùng nodemon trong production)
CMD ["node", "index.js"]

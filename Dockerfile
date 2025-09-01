# Stage 1: Build
FROM node:20 AS builder
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код
COPY . .

# Сборка TypeScript
RUN npm run build

# Stage 2: Production
FROM node:20-slim
WORKDIR /usr/src/app

# Копируем зависимости и билд из стадии builder
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Открываем порт
EXPOSE 8000

# Команда для запуска приложения
CMD ["node", "dist/server.js"]

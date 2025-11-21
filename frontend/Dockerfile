FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install 

# копіюємо весь код фронтенду
COPY . .

# відкриваємо порт для Vite
EXPOSE 5173

# запускаємо dev сервер Vite
CMD ["npm", "run", "dev", "--", "--host"]

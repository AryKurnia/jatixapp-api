FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose port sesuai .env (default 3000)
EXPOSE 3000

CMD ["npm", "start"]
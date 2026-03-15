FROM node:18-alpine

WORKDIR usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 1234

CMD ["node","server.js"]
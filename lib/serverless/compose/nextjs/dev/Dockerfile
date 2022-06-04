FROM node:alpine

WORKDIR /app

COPY ./package*.json ./

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "run", "dev"]
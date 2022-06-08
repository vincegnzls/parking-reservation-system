FROM node:alpine

WORKDIR /app

COPY ./package*.json ./

RUN npm install --force --legacy-peer-deps

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "run", "dev"]
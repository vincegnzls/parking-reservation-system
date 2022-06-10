FROM node:alpine

WORKDIR /usr/src/app/my-app

COPY package*.json ./

RUN npm install --force --legacy-peer-deps

EXPOSE 3000

CMD ["npm", "run", "dev"]
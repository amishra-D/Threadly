FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000 3001 3002 3003 3004 3005
CMD [ "npm", "run", "dev" ]

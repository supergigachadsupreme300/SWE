FROM node:18-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm install --production=false || true
COPY . .
EXPOSE 8000
CMD ["npm", "run", "start:dev"]

FROM node:21-alpine

WORKDIR /app

COPY package*.json ./

COPY client/package*.json client/
RUN npm run install-client --omit=dev

COPY server/package*.json server/
RUN npm run install-server --omit=dev

COPY client/ client/
RUN npm run build-dev --prefix client
USER node

COPY server/ server/
CMD ["npm", "start", "--prefix", "server"]

EXPOSE 8000
FROM node:23-alpine
WORKDIR /build
COPY . ./
RUN npm install
EXPOSE 3000
ENTRYPOINT npm run build && npm start

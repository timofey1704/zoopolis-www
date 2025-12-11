FROM node:24-alpine
WORKDIR /app
COPY . ./
ARG NEXT_PUBLIC_API_URL=https://stage.zoopolis.org/api/v1
RUN npm install && npm run build
EXPOSE 3000
ENTRYPOINT ["npm", "start"]

FROM node:23-alpine
WORKDIR /app
COPY --chmod=755 <<EOT ./entrypoint.sh
#!/usr/bin/env sh
set -e
npm run &&
npm start
EOT
COPY . ./
RUN npm install
EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]

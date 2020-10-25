FROM node:12-alpine as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile --network-timeout 600000
COPY tsconfig.json tsconfig.json
COPY src/ src/
RUN yarn build

FROM node:12-alpine as prod
RUN apk add --no-cache git
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --prod
COPY --from=builder /app/dist/ ./dist/
CMD ["node", "/app/dist/index.js"]

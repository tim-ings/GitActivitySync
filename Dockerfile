FROM node:14-alpine as base
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile --network-timeout 600000
COPY tsconfig.json tsconfig.json
COPY src/ src/

FROM base as dev
CMD ["yarn", "watch"]

FROM base as builder
RUN yarn build

FROM node:12-alpine as prod
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --prod
COPY --from=builder /app/dist/ ./dist/
CMD ["node", "/app/dist/index.js"]

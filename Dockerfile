FROM node:14.17.6-alpine as builder

WORKDIR /app

COPY . .

RUN yarn install \
  --prefer-offline \
  --frozen-lockfile \
  --non-interactive \
  --production=false

RUN yarn build

RUN rm -rf node_modules && \
  NODE_ENV=production yarn install \
  --prefer-offline \
  --pure-lockfile \
  --non-interactive \
  --production=true

FROM node:14.17.6-alpine

WORKDIR /app

COPY --from=builder /app  .

ENV NUXT_HOST 0.0.0.0
ENV NUXT_PORT 80

CMD [ "yarn", "start" ]

FROM node:20-alpine as builder
COPY ./astro /app
WORKDIR /app
RUN yarn install && yarn build 

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist dist
COPY --from=builder /app/node_modules ./node_modules
COPY ./astro/package.json ./
COPY ./pm2.json ./

RUN yarn global add pm2
EXPOSE 3000/tcp
ENTRYPOINT ["pm2", "start", "./pm2.json", "--no-daemon"]


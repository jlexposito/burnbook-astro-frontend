FROM node:20-alpine as base
RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app
COPY astro/package.json astro/pnpm-lock.yaml ./
RUN pnpm install

FROM base AS build

WORKDIR /app
COPY ./astro .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build
# We cant use prod now since we have a dev dependecy to build
#RUN pnpm prune --prod
RUN pnpm prune

FROM base AS deploy

WORKDIR /app
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules
COPY ./pm2.json ./
RUN npm i -g pm2

EXPOSE 3000/tcp
ENTRYPOINT ["pm2", "start", "./pm2.json", "--no-daemon"]


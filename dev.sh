#!/bin/bash
VERSION=23-alpine
docker pull node:$VERSION
docker run -v `pwd`/astro:/code -e HOST=0.0.0.0 -w /code --network=host -it --rm node:$VERSION /bin/sh -c "npm install npm@latest -g; npm i -g pnpm; pnpm install; pnpm run dev --host 0.0.0.0"
docker run -v `pwd`/astro:/code -e HOST=0.0.0.0 -w /code --network=host -it --rm node:$VERSION /bin/sh


#!/bin/bash
sudo docker run -v `pwd`/astro:/code -e HOST=0.0.0.0 -w /code --network=host -it --rm node:20-alpine /bin/sh -c "npm install npm@latest -g; npm i -g pnpm; pnpm install; pnpm run dev --host 0.0.0.0"
sudo docker run -v `pwd`/astro:/code -e HOST=0.0.0.0 -w /code --network=host -it --rm node:20-alpine /bin/sh


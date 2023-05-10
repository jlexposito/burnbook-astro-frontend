#!/bin/bash
sudo docker run -v `pwd`/astro:/code -e HOST=0.0.0.0 -w /code --network=host -it --rm node:20-alpine /bin/sh -c "npm i -g pnpm; pnpm install; pnpm run dev"
sudo docker run -v `pwd`/astro:/code -e HOST=0.0.0.0 -w /code --network=host -it --rm node:20-alpine /bin/sh


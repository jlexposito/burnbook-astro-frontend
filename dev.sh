#!/bin/bash
VERSION=24-alpine
docker pull node:$VERSION

# Try to get the Tailscale IP, fallback to localhost if it fails or is empty
if ! HOST_IP=$(tailscale ip -4 2>/dev/null) || [ -z "$HOST_IP" ]; then
  HOST_IP="localhost"
  echo "Tailscale IP not available. Falling back to host: $HOST_IP"
else
  echo "Found Tailscale IP: $HOST_IP"
fi

# Run the Docker container
docker run -v `pwd`/astro:/code -e HOST=$HOST_IP -w /code --network=host -it --rm node:$VERSION /bin/sh -c "npm install npm@latest -g; npm i -g pnpm; pnpm install; pnpm run dev --host $HOST_IP"


docker run -v `pwd`/astro:/code -e HOST=0.0.0.0 -w /code --network=host -it --rm node:$VERSION /bin/sh -c "npm install npm@latest -g; npm i -g pnpm; pnpm install; pnpm run dev --host 0.0.0.0"
docker run -v `pwd`/astro:/code -e HOST=0.0.0.0 -w /code --network=host -it --rm node:$VERSION /bin/sh


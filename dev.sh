#!/bin/bash
sudo docker run -v `pwd`/astro:/code -w /code --network=host -it --rm node:19-alpine /bin/sh -c "yarn dev"
sudo docker run -v `pwd`/astro:/code -w /code --network=host -it --rm node:19-alpine /bin/sh


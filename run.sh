#!/bin/bash

set -e

# Build Docker image
docker build --build-arg MONGODB_HOST_ARG=$MONGODB_HOST JWT_SECRET_ARG=$JWT_SECRET --build-arg JWT_EXPIRATION_ARG=$JWT_EXPIRATION -t assessment .

# Stop and remove existing containers
docker stop assessment || true
docker rm assessment || true

# Run Docker container
docker run -d --name assessment -p 3000:3000 assessment

FROM node:21
WORKDIR /app

# Define build arguments
ARG MONGODB_HOST_ARG=localhost
ARG JWT_SECRET_ARG=localhost
ARG JWT_EXPIRATION_ARG=localhost

ENV MONGODB_HOST=$MONGODB_HOST_ARG
ENV JWT_SECRET=$JWT_SECRET_ARG
ENV JWT_EXPIRATION=$JWT_EXPIRATION_ARG

# copy configs
COPY package*.json ./
COPY pnpm-lock.yaml ./
# setup pnpm

RUN npm install -g pnpm
RUN pnpm install

#build
COPY . .
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run","start:prod"]
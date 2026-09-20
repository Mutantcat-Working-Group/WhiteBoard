# Online whiteboard image: builds the Vue app and serves it with nginx.
FROM node:18-alpine AS build

ARG VERSION=1.0.20260920

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM nginx:1.27-alpine AS runtime

ARG VERSION=1.0.20260920

COPY --from=build /app/docs /usr/share/nginx/html

LABEL org.opencontainers.image.version="${VERSION}"

EXPOSE 80

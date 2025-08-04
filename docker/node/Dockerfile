FROM node:24.4.1-alpine3.21

RUN apk add --no-cache \
    sqlite \
    sqlite-dev \
    tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata

FROM node:24.5.0-alpine3.21

RUN apk add --no-cache \
    tzdata && \
    cp /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && \
    apk del tzdata

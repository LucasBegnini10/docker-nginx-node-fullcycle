FROM ubuntu:latest as builder

RUN apt update && \
    apt install -y wget netcat-traditional && \
    wget -q -O /usr/bin/wait-for https://raw.githubusercontent.com/eficode/wait-for/v2.2.3/wait-for


FROM node:20-alpine as runtime

COPY --from=builder /usr/bin/wait-for /usr/bin/wait-for
RUN chmod +x /usr/bin/wait-for

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
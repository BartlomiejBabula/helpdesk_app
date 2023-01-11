FROM oraclelinux:7-slim as development


WORKDIR /usr/src/app

COPY package*.json .

RUN yum update -y && \
  yum install -y oracle-release-el7 && \
  yum install -y oracle-nodejs-release-el7 && \
  yum install -y install nodejs && \
  yum install -y oracle-instantclient19.3-basic.x86_64 && \
  yum clean all && \
  node --version && \
  npm --version && \
  npm install 

COPY . .

RUN npm run build



FROM node:18.12.1-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --only=production

COPY --from=development /usr/src/app/build ./build

CMD ["node", "build/index.js"]



FROM ubuntu:24.04 as development

#  ENV http_proxy http://proxy-rze.asseco.pl:8080
#  ENV https_proxy http://proxy-rze.asseco.pl:8080

WORKDIR /usr/src/app

COPY package*.json .

# Update Ubuntu Software repository
RUN apt update
RUN apt upgrade -y
RUN apt-get install -yq tzdata && \
    ln -fs /usr/share/zoneinfo/Europe/Warsaw /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata

# Install node and npm
RUN apt install -y nodejs
RUN apt install -y npm
RUN rm -rf /var/lib/apt/lists/*
RUN apt clean

# Install NestJS
RUN npm i -g @nestjs/cli

# Install node_modules
RUN npm install

# Oracle database
RUN apt-get update
# RUN apt-get install -y libaio1
RUN apt-get install -y unzip
# RUN cd /usr/src/app/src/oracle && unzip instantclient -d /usr/src/app/src/oracle
RUN sh -c "echo /usr/src/app/src/oracle/instantclient_19_19 > /etc/ld.so.conf.d/oracle-instantclient.conf"

#CLEAR
RUN apt autoremove -y

RUN ldconfig
COPY . .







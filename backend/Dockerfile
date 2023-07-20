FROM ubuntu:20.04 as development


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

#Install python
RUN apt update && apt upgrade -y
RUN apt install -y wget build-essential libncursesw5-dev libssl-dev \
libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev libffi-dev zlib1g-dev
RUN apt install -y python3.9
RUN apt install -y pip

#Install robotFramework
RUN pip install cx_Oracle
RUN pip install openpyxl
RUN pip install numpy
RUN pip install robotframework
RUN pip install --upgrade robotframework-seleniumlibrary
RUN pip install selenium==4.9.1
RUN pip install robotframework-browser
RUN rfbrowser init
RUN apt-get -y install firefox
RUN wget https://github.com/mozilla/geckodriver/releases/download/v0.25.0/geckodriver-v0.25.0-linux64.tar.gz

# Update node
RUN wget -qO- https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs

# Install node_modules
RUN npm install

# Oracle database
RUN apt-get install -y libaio1
RUN apt-get install -y unzip
# RUN cd /usr/src/app/src/oracle && unzip instantclient -d /usr/src/app/src/oracle
RUN sh -c "echo /usr/src/app/src/oracle/instantclient_19_19 > /etc/ld.so.conf.d/oracle-instantclient.conf"
RUN ldconfig

#CLEAR
RUN apt autoremove -y

COPY . .

RUN npm run build
RUN ldconfig








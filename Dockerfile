FROM node:argon
# http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/

FROM       ubuntu:16.04
MAINTAINER Docker

# Installation:
# Import MongoDB public GPG key AND create a MongoDB list file
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
RUN echo "deb http://repo.mongodb.org/apt/ubuntu $(cat /etc/lsb-release | grep DISTRIB_CODENAME | cut -d= -f2)/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list

# Update apt-get sources AND install MongoDB
RUN apt-get update && apt-get install -y mongodb-org

# Create the MongoDB data directory
RUN mkdir -p /data/db

# Expose port #27017 from the container to the host
EXPOSE 27017

# Set /usr/bin/mongod as the dockerized entry-point application
ENTRYPOINT ["/usr/bin/mongod"]

RUN apt-get update && apt-get install -y \
      curl \
      npm \
      nodejs \
      git;

# compatibility fix for node on ubuntu
RUN ln -s /usr/bin/nodejs /usr/bin/node;

# install nvm
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.24.1/install.sh | sh;

# invoke nvm to install node
RUN cp -f ~/.nvm/nvm.sh ~/.nvm/nvm-tmp.sh; \
    echo "nvm install 0.12.2; nvm alias default 0.12.2" >> ~/.nvm/nvm-tmp.sh; \
    sh ~/.nvm/nvm-tmp.sh; \
    rm ~/.nvm/nvm-tmp.sh;

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 8080

CMD [ "npm", "start" ]

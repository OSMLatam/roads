FROM node:7.7.1

EXPOSE 8080

# Setup env
ENV APP_USER=node
ENV HOME=/home/node
ENV DATA=/data

# Install global npm dependencies
RUN npm install -g nodemon

# Copy config files and assign app directory permissions
WORKDIR $HOME/roads
COPY package.json $HOME/roads/

# Create data directory and assign permissions
RUN mkdir /data && chown $APP_USER:$APP_USER /data
VOLUME /data

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

CMD [ "npm", "start" ]

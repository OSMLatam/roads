FROM node:7.7.1

EXPOSE 3000

# Setup env
ENV APP_USER=node
ENV HOME=/home/node
ENV DATA=/data

# Grab gosu for easy step-down from root
ENV GOSU_VERSION 1.7
RUN set -x \
	&& wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture)" \
	&& wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture).asc" \
	&& export GNUPGHOME="$(mktemp -d)" \
	&& gpg --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 \
	&& gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu \
	&& rm -r "$GNUPGHOME" /usr/local/bin/gosu.asc \
	&& chmod +x /usr/local/bin/gosu \
	&& gosu nobody true

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

# Install app
RUN chown -R $APP_USER:$APP_USER $HOME/roads && \
  gosu $APP_USER:$APP_USER npm install

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

# Run node server
CMD ["node", "src/"]

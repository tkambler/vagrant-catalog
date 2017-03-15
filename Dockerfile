FROM vagrant-catalog-base:latest
COPY package.json yarn.lock /opt/app/
WORKDIR /opt/app
RUN yarn
COPY . /opt/app
EXPOSE 9000
VOLUME /opt/app/boxes
ENTRYPOINT npm start

FROM vagrant-catalog-base:latest
COPY . /opt/app
WORKDIR /opt/app
RUN mkdir uploads
RUN yarn
EXPOSE 9000
VOLUME /opt/app/boxes
ENTRYPOINT yarn start

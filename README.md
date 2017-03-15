# Vagrant Catalog

## Running Vagrant Catalog

Modify `docker-compose.yml` as needed and run:

    $ docker-compose up -d

Or:

    $ docker run --rm -ti \
        -p "9000:9000" \
        -v /boxes:/opt/app/boxes \
        -e PORT=9000 \
        -e BASE_URL="http://mysite.com:9000" \
        tkambler/vagrant-catalog

## Building Docker Images

    $ docker build -f Dockerfile.base -t vagrant-catalog-base . && \
        docker build -t tkambler/vagrant-catalog .

## TODO

- UI for adding / managing images

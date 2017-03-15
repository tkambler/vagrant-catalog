# Vagrant Catalog

## Building Docker Images

    $ docker build -f Dockerfile.base -t vagrant-catalog-base . && \
        docker build -t tkambler/vagrant-catalog .

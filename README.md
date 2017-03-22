# Vagrant Catalog

![Screenshot](./misc/screenshot.png)

This application allows you to run your own private Vagrant cloud instance. In other words, it provides a UI for managing boxes, which can then be referenced in a Vagrantfile as shown below:

```
Vagrant.configure("2") do |config|

    config.vm.box = "org/box-name"
    config.vm.box_url = "https://vagrant.myorg.com/api/boxes/org/box-name"

end
```

## Running Vagrant Catalog

### Via Docker

[Docker](https://docker.com) is the suggested method of installation. Run the following command, substituting appropriate values for the `PORT` and `BASE_URL` environment variables. You should also map a folder on your host to the `/opt/app/boxes` folder within the container.

```bash
$ docker run --rm -ti \
    -p "9000:9000" \
    -v /boxes:/opt/app/boxes \
    -e PORT=9000 \
    -e BASE_URL="http://mysite.com:9000" \
    tkambler/vagrant-catalog
```

### Directly on the Host

You can also forego the use of Docker and run the application directly on your host by running the following commands. Note that we use [Yarn](https://yarnpkg.com) as our package management system of choice.

```bash
$ yarn
$ yarn start
```

## Building Docker Images

Run the following command to build the Docker images from scratch:

```bash
$ docker build -f Dockerfile.base -t vagrant-catalog-base . && \
    docker build -t tkambler/vagrant-catalog .
```

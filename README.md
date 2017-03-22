# Vagrant Catalog

![Screenshot](./misc/screenshot.png)

This application allows you to run your own private Vagrant catalog. In other words, it provides a UI for managing boxes, which can then be referenced in a Vagrantfile as shown below:

```
Vagrant.configure("2") do |config|

    config.vm.box = "org/box-name"
    config.vm.box_url = "https://vagrant.myorg.com/api/boxes/org/box-name"

end
```

## Getting Started

### Running Vagrant Catalog

#### Via Docker

[Docker](https://docker.com) is the suggested method of installation. Run the following command, substituting appropriate values for the `PORT` and `BASE_URL` environment variables. You should also map the `boxes` folder in the root of this project to the `/opt/app/boxes` folder within the container. You can, of course, move that folder to a different location if you want.

```bash
$ docker run --rm -ti \
    -p "9000:9000" \
    -v /boxes:/opt/app/boxes \
    -e PORT=9000 \
    -e BASE_URL="http://mysite.com:9000" \
    tkambler/vagrant-catalog
```

---

#### Directly on the Host

You can also forego the use of Docker and run the application directly on your host by running the following commands. Note that we use [Yarn](https://yarnpkg.com) as our package management system of choice.

```bash
$ yarn
$ yarn start
```

### Using the Application

Open the app in your browser. The first thing you'll want to do is create an account for yourself. Afterwards, if you do _not_ want to allow others to register:

- Stop the process
- Open the `boxes/config.json` file
- Set `registration.enabled` to `false`
- Restart the process

After signing in, you should be able to manage your catalog.

## Building Docker Images

Run the following command to build the Docker images from scratch:

```bash
$ docker build -f Dockerfile.base -t vagrant-catalog-base . && \
    docker build -t tkambler/vagrant-catalog .
```

'use strict';

const config = require('app/config');
const express = require('express');
const app = express();
const morgan = require('morgan');
const boxes = require('app/boxes');
const log = require('app/log');
const path = require('path');

app.use(morgan('combined'))

app.use('/', express.static(config.get('frontend_dir')));

app.route('/api/ping')
    .get((req, res, next) => {
        return res.send({
            'response': 'pong'
        });
    });

app.route('/api/config')
    .get((req, res, next) => {

        let conf = {
            'registration': {
                'enabled': config.get('registration:enabled')
            }
        };

        return res.send(conf);

    });

app.route('/api/boxes/:org_name/:box_name.json')
    .get((req, res, next) => {

        log.info(`Fetching metadata for box`, {
            'box': `${req.params.org_name}/${req.params.box_name}`
        });

        return boxes.getBox(req.params.org_name, req.params.box_name)
            .tap((box) => {
                log.info('Found box', {
                    'box': box
                });
            })
            .then(res.send.bind(res))
            .catch(next);

    });

app.route('/api/boxes/:org_name/:box_name/:provider_name/:file')
    .get((req, res, next) => {

        log.info(`Fetching box file`, {
            'box': `${req.params.org_name}/${req.params.box_name}/${req.params.provider_name}/${req.params.file}`
        });

        return boxes.getBoxFileStream(req.params.org_name, req.params.box_name, req.params.provider_name, req.params.file)
            .then((data) => {

                res.writeHead(200, {
                    'Content-Type': 'application/octet-stream',
                    'Content-Length': data.size
                });

                return data.stream.pipe(res);
            })
            .catch(next);

    });

app.listen(config.get('port'), () => {
    log.info(`vagrant-catalog is listening on port: ${config.get('port')}`);
});

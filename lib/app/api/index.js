'use strict';

const config = require('app/config');
const express = require('express');
const app = express();
const boxes = require('app/boxes');
const log = require('app/log');

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
            .then((boxStream) => {
                return boxStream.pipe(res);
            })
            .catch(next);

    });

app.listen(config.get('port'), () => {
    log.info(`vagrant-catalog is listening on port: ${config.get('port')}`);
});

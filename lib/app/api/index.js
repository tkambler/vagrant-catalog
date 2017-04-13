'use strict';

const Promise = require('bluebird');
const config = require('app/config');
const express = require('express');
const app = express();
const morgan = require('morgan');
const boxes = require('app/boxes');
const log = require('app/log');
const path = require('path');
const meddleware = require('meddleware');
const bodyParser = require('body-parser');
const Joi = require('joi-transform');
const User = require('app/models/user');
const _ = require('lodash');

app.on('middleware:after', (e) => {
    log.info(`Registered middleware: ${e.config.name}`);
});

app.use(meddleware(config.get('meddleware')));

/*
app.route('/api/boxes/:org_name/:box_name')
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

app.route('/api/users/:user_id/boxes/:org_name/:box_name')
    .delete((req, res, next) => {

        return Promise.resolve()
            .then(() => {

                if (parseInt(req.params.user_id, 10) !== req.session.user_id) throw new Error(`Permission denied`);

                return boxes.deleteBox(req.params.org_name, req.params.box_name);

            })
            .then(() => {

                return res.status(200).end();

            })
            .catch(next);

    });

app.route('/api/users/:user_id/boxes/:org_name/:box_name/versions')
    .post((req, res, next) => {

        return Promise.resolve()
            .then(() => {

                if (parseInt(req.params.user_id, 10) !== req.session.user_id) throw new Error(`Permission denied`);

                return Joi.transform(req.body, {
                    'version': Joi.string().required().label('Version')
                });

            })
            .then(([data]) => {

                // TODO: validate semver

                return boxes.createVersion(req.params.org_name, req.params.box_name, data.version);

            })
            .then(res.send.bind(res))
            .catch(next);

    });

app.route('/api/users/:user_id/boxes/:org_name/:box_name/versions/:version')
    .delete((req, res, next) => {

        return Promise.resolve()
            .then(() => {

                if (parseInt(req.params.user_id, 10) !== req.session.user_id) throw new Error(`Permission denied`);

                // TODO: validate semver

                return boxes.deleteVersion(req.params.org_name, req.params.box_name, req.params.version);

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
*/

app.use((err, req, res, next) => {
    return res.status(500).send({
        'error': err.toString()
    });
});

app.listen(config.get('port'), () => {
    log.info(`vagrant-catalog is listening on port: ${config.get('port')}`);
});

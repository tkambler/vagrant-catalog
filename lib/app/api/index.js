'use strict';

const Promise = require('bluebird');
const config = require('app/config');
const express = require('express');
const app = express();
const morgan = require('morgan');
const boxes = require('app/boxes');
const log = require('app/log');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const Joi = require('joi-transform');
const User = require('app/models/user');
const _ = require('lodash');
const knex = require('app/knex');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const store = new KnexSessionStore({
    'knex': knex
});

const upload = multer({
    'dest': config.get('uploads_dir')
});

app.use(morgan('combined'));

app.use(session({
    'secret': config.get('session:secret'),
    'store': store,
    'resave': true,
    'saveUninitialized': false
}));

const whitelistUrls = {
    '/api/config': ['GET'],
    '/api/ping': ['GET'],
    '/api/users/register': ['PUT'],
    '/api/users/sessions': ['DELETE', 'POST'],
    '/api/session': ['DELETE'],
};

app.use((req, res, next) => {

    if (req.url.indexOf('/api') !== 0) return next();

    if (req.url.indexOf('/api/boxes') === 0 && req.method === 'GET') {
        return next();
    }

    const sessionUserId = _.get(req, 'session.user_id');

    if (!sessionUserId && _.get(whitelistUrls, req.url, []).indexOf(req.method) >= 0) {
        return next();
    }

    if (!sessionUserId) throw new Error(`Permission Denied`);

    return User.where({
        'id': sessionUserId
    })
        .fetch({
            'require': true
        })
        .then((user) => {
            req.sessionUser = user;
            return next();
        })
        .catch((err) => {
            if (_.get(whitelistUrls, req.url, []).indexOf(req.method) >= 0) {
                return next();
            } else {
                throw new Error(`Permission Denied`);
            }
        });

});

app.use(bodyParser.json());
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

app.route('/api/users/register')
    .put((req, res, next) => {

        return Promise.resolve()
            .then(() => {

                if (!config.get('registration:enabled')) {
                    throw new Error(`Registration is disabled.`);
                }

                return Joi.transform(req.body, {
                    'first_name': Joi.string().required().label('First Name'),
                    'last_name': Joi.string().required().label('Last Name'),
                    'username': Joi.string().required().label('Username'),
                    'password': Joi.string().required().label('Password'),
                    'email': Joi.string().required().label('Email Address')
                }, {

                    'hash': (data) => {

                        const User = require('app/models/user');
                        return User.hashPassword(data.password);

                    }

                });

            })
            .then(([data, transformed]) => {

                data.password_hash = transformed.hash;
                delete data.password;
                const User = require('app/models/user');

                return User.forge(data).save();

            })
            .then(res.send.bind(res))
            .catch(next);

    });

app.route('/api/users/:user_id')
    .get((req, res, next) => {

        return Promise.resolve()
            .then(() => {

                const User = require('app/models/user');
                return User.where({
                    'id': req.params.user_id
                })
                    .fetch({
                        'require': true
                    });

            })
            .then(res.send.bind(res))
            .catch(next)

    });

app.route('/api/users/:user_id/boxes')
    .get((req, res, next) => {

        return Promise.resolve()
            .then(() => {

                const User = require('app/models/user');
                return User.where({
                    'id': req.params.user_id
                })
                    .fetch({
                        'require': true
                    });

            })
            .then((user) => {

                return boxes.getBoxes(user.get('username'))
                    .map((box) => {
                        return boxes.getBox(user.get('username'), box)
                            .then((box) => {
                                box.url = `${config.get('base_url')}/api/boxes/${box.name}`;
                                return box;
                            });
                    });

            })
            .then(res.send.bind(res))
            .catch(next)

    });

app.route('/api/users/sessions')
    .post((req, res, next) => {

        return Joi.transform(req.body, {
            'username': Joi.string().required().label('Username'),
            'password': Joi.string().required().label('Password')
        }, {

            'user': (data) => {

                const User = require('app/models/user');
                return User.where({
                    'username': data.username
                })
                    .fetch({
                        'require': true
                    })
                    .then((user) => {
                        return user.validatePassword(data.password);
                    });

            }

        })
        .then(([data, transformed]) => {

            req.session.user_id = transformed.user.id;


            return transformed.user.toJSON();

        })
        .then(res.send.bind(res))
        .catch(next);

    })
    .delete((req, res, next) => {

        req.session.destroy();
        return res.status(200).end();

    });

app.route('/api/session')
    .get((req, res, next) => {

        return Promise.resolve()
            .then(() => {

                const User = require('app/models/user');
                return User.where({
                    'id': req.session.user_id
                })
                    .fetch({
                        'require': true
                    });

            })
            .then(res.send.bind(res))
            .catch(next);

    })
    .delete((req, res, next) => {

        if (req.session) {
            req.session.destroy();
        }

        return res.status(200).end();

    });

app.route('/api/users/:user_id/boxes')
    .post((req, res, next) => {

        return Promise.resolve()
            .then(() => {

                if (parseInt(req.params.user_id, 10) !== req.session.user_id) throw new Error(`Permission denied`);

                return Joi.transform(req.body, {
                    'name': Joi.string().required().label('Name'),
                    'description': Joi.string().optional().label('Description')
                });

            })
            .then(([data]) => {

                return boxes.createBox(req.sessionUser.get('username'), data.name, data.description);

            })
            .then(res.send.bind(res))
            .catch(next);

    });

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

app.route('/api/users/:user_id/boxes/:org_name/:box_name/versions/:version/providers')
    .post(upload.single('box'), (req, res, next) => {

        return Promise.resolve()
            .then(() => {

                if (parseInt(req.params.user_id, 10) !== req.session.user_id) throw new Error(`Permission denied`);

                return Joi.transform(req.body, {
                    'name': Joi.string().required().label('Name')
                });

                // TODO: validate semver

            })
            .then(([data]) => {

                return boxes.addVersionProvider(req.params.org_name, req.params.box_name, req.params.version, data.name, {
                    'filename': req.file.originalname,
                    'path': req.file.path
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

app.use((err, req, res, next) => {
    return res.status(500).send({
        'error': err.toString()
    });
});

app.listen(config.get('port'), () => {
    log.info(`vagrant-catalog is listening on port: ${config.get('port')}`);
});

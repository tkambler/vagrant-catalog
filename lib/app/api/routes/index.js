'use strict';

module.exports = (router) => {

    const getZoom = require('app/api/lib/get-zoom');
    const _ = require('lodash');
    const User = require('app/models/user');
    const Box = require('app/models/box');
    const BoxVersion = require('app/models/box-version');
    const BoxVersionProvider = require('app/models/box-version-provider');

    router.param('user_id', (req, res, next, id) => {

        const where = {};
        const idNum = parseInt(id, 10);

        if (_.isFinite(idNum)) {
            where.id = idNum;
        } else {
            where.username = id;
        }

        return User.where(where)
            .fetch({
                'withRelated': getZoom(req, 'company_data_schema_id'),
                'require': true
            })
            .then((user) => {
                req.user = user;
                next();
            })
            .catch(next);

    });

    router.param('box_name', (req, res, next, id) => {

        if (!req.user) return res.status(404).end();

        const where = {
            'user_id': req.user.id
        };
        const idNum = parseInt(id, 10);
        if (_.isFinite(idNum)) {
            where.id = idNum;
        } else {
            where.name = id;
        }

        return Box.where(where)
            .fetch({
                'require': true
            })
            .then((box) => {
                req.box = box;
                return next();
            })
            .catch(next);

    });

    router.param('version_id', (req, res, next, id) => {

        if (!req.box) return res.status(404).end();

        return BoxVersion.where({
            'id': parseInt(id, 10),
            'box_id': req.box.id
        })
            .fetch({
                'require': true
            })
            .then((version) => {
                req.version = version;
                return next();
            })
            .catch(next);

    });

    router.param('provider_id', (req, res, next, id) => {

        if (!req.version) return res.status(404).end();

        return BoxVersionProvider.where({
            'id': parseInt(id, 10),
            'box_version_id': req.version.id
        })
            .fetch({
                'require': true
            })
            .then((provider) => {
                req.provider = provider;
                return next();
            })
            .catch(next);

    });

};

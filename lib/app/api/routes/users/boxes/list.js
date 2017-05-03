'use strict';

module.exports = (req, res, next) => {

    const config = require('app/config');
    const Promise = require('bluebird');

    return Promise.resolve()
        .then(() => {

            if (req.query.withRelated.indexOf('versions') >= 0) {

                return req.user.load(['boxes', 'boxes.versions', 'boxes.versions.providers'])
                    .then(() => {
                        return req.user.related('boxes');
                    });

            } else {

                return req.user.load('boxes')
                    .then(() => {
                        return req.user.related('boxes');
                    });

            }

        })
        .then((boxes) => {
            return boxes.toArray();
        })
        .map((box) => {

            let record = box.toJSON();
            record.url = `${config.get('base_url')}/api/boxes/${req.user.get('username')}/${record.name}`;
            return record;

        })
        .then(res.send.bind(res))
        .catch(next);

};

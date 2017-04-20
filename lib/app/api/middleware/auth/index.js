'use strict';

module.exports = () => {

    const User = require('app/models/user');
    const _ = require('lodash');

    const whitelistUrls = {
        '/api/config': ['GET'],
        '/api/ping': ['GET'],
        '/api/users/register': ['PUT'],
        '/api/users/sessions': ['DELETE', 'POST'],
        '/api/session': ['DELETE'],
    };

    return (req, res, next) => {

        if (req.url.indexOf('/api') !== 0) return next();

        if (req.url.indexOf('/api/boxes') === 0 && ['HEAD', 'OPTIONS', 'GET'].indexOf(req.method) >= 0) {
            return next();
        }

        if (req.url.indexOf('download') >= 0) {
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

    };

};

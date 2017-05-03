'use strict';

module.exports = (req, res, next) => {

    const Promise = require('bluebird');

    return Promise.resolve()
        .then(() => {

            if (req.box.get('user_id') !== req.sessionUser.id) throw new Error('Permission Denied');

            return req.box.destroy();

        })
        .then(() => {

            return res.status(200).end();

        })
        .catch(next);

};

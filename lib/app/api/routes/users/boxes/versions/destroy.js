'use strict';

module.exports = (req, res, next) => {

    const Promise = require('bluebird');

    return Promise.resolve()
        .then(() => {

            if (req.user.id !== req.session.user_id) throw new Error(`Permission denied`);

            return req.version.destroy();

        })
        .then(() => {

            return res.status(200).end();

        })
        .catch(next);

};

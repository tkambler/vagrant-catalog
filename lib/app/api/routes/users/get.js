'use strict';

module.exports = (req, res, next) => {

    const Promise = require('bluebird');
    const User = require('app/models/user');

    return Promise.resolve()
        .then(() => {

            return User.where({
                'id': req.params.user_id
            })
                .fetch({
                    'require': true
                });

        })
        .then(res.send.bind(res))
        .catch(next)

};

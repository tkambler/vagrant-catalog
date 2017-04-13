'use strict';

module.exports = (req, res, next) => {

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

};

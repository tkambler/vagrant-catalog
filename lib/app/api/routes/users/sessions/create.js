'use strict';

module.exports = (req, res, next) => {

    const Joi = require('joi-transform');
    const User = require('app/models/user');

    return Joi.transform(req.body, {
        'username': Joi.string().required().label('Username'),
        'password': Joi.string().required().label('Password')
    }, {

        'user': (data) => {

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

};

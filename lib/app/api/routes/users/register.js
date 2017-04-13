'use strict';

module.exports = (req, res, next) => {

    const Promise = require('bluebird');
    const User = require('app/models/user');
    const Joi = require('joi-transform');
    const config = require('app/config');

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

            return User.forge(data).save();

        })
        .then(res.send.bind(res))
        .catch(next);


};

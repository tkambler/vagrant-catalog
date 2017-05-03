'use strict';

module.exports = (req, res, next) => {

    const Joi = require('joi-transform');
    const Promise = require('bluebird');
    const BoxVersionProvider = require('app/models/box-version-provider');
    const uuid = require('uuid');
    const checksum = require('app/checksum');
    const fs = require('app/fs');
    const path = require('path');
    const config = require('app/config');

    return Promise.resolve()
        .then(() => {

            if (req.user.id !== req.session.user_id) throw new Error(`Permission denied`);

            return req.provider.destroy();

        })
        .then(() => {

            return res.status(200).end();

        })
        .catch(next);

};

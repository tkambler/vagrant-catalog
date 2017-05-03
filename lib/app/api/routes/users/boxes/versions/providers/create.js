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

                return Joi.transform(req.body, {
                    'name': Joi.string().required().label('Name')
                }, {
                    'uuid': (data) => {
                        return uuid.v4();
                    },
                    'checksum': (data) => {
                        return checksum.fileAsync(req.file.path, {
                            'algorithm': 'sha256'
                        });
                    }
                });

            })
            .then(([data, transformed]) => {

                return BoxVersionProvider
                    .where({
                        'box_version_id': req.version.id,
                        'name': data.name
                    })
                    .fetch()
                    .then((provider) => {
                        if (provider) throw new Error(`A provider with the name '${data.name}' already exists`);
                        return [data, transformed];
                    });


        })
        .then(([data, transformed]) => {

            return req.version.related('providers').create({
                'name': data.name,
                'file': transformed.uuid,
                'checksum': transformed.checksum,
                'original_filename': req.file.originalname
            });

        })
        .tap((provider) => {

            return fs.ensureDirAsync(provider.getFileFolder())
                .then(() => {
                    return fs.copyAsync(req.file.path, provider.getFilePath());
                })
                .then(() => {
                    return fs.unlinkAsync(req.file.path);
                });

        })
        .then(res.send.bind(res))
        .catch(next);

};

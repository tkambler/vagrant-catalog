'use strict';

module.exports = (req, res, next) => {

    const Joi = require('joi-transform');
    const semver = require('semver');

    return Promise.resolve()
        .then(() => {

            if (req.user.id !== req.session.user_id) throw new Error(`Permission denied`);

            return Joi.transform(req.body, {
                'version': Joi.string().required().label('Version')
            });

        })
        .then(([data]) => {

            if (!semver.valid(data.version)) {
                throw new Error('Invalid version number');
            }

            return req.box.related('versions').create({
                'version': data.version
            });

        })
        .then(res.send.bind(res))
        .catch(next);

};

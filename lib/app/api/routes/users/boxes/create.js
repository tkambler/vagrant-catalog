'use strict';

module.exports = (req, res, next) => {

    const Joi = require('joi-transform');

    return Promise.resolve()
        .then(() => {

            if (req.user.id !== req.session.user_id) throw new Error(`Permission denied`);

            return Joi.transform(req.body, {
                'name': Joi.string().required().label('Name'),
                'description': Joi.string().optional().label('Description')
            });

        })
        .then(([data]) => {

            return req.user.related('boxes').create(data);

        })
        .then(res.send.bind(res))
        .catch(next);

};

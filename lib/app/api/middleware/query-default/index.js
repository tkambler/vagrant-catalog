'use strict';

module.exports = () => {

    return (req, res, next) => {

        const _ = require('lodash');
        req.query.withRelated = _.isArray(req.query.withRelated) ? req.query.withRelated : [req.query.withRelated];
        return next();

    };

};

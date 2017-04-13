'use strict';

const _ = require('lodash');

module.exports = (req, param, validEntries) => {
    if (!req.query.zoom) {
        return [];
    }
    if (_.isString(req.query.zoom)) {
        req.query.zoom = [req.query.zoom];
    }
    req.query.zoom = _.compact(req.query.zoom);
    if (_.isEmpty(req.query.zoom)) {
        return [];
    }
    let tmp = req.route.path.split('/');
    let last = tmp.pop();
    if (last !== ':' + param) {
        return [];
    }
    if (!validEntries) {
        return req.query.zoom;
    }
    return _.intersection(req.query.zoom, validEntries);
};

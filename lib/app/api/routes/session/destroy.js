'use strict';

module.exports = (req, res, next) => {

    if (req.session) {
        req.session.destroy();
    }

    return res.status(200).end();

};

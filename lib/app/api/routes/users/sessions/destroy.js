'use strict';

module.exports = (req, res, next) => {

    req.session.destroy();
    return res.status(200).end();

};

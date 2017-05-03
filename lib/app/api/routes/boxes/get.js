'use strict';

module.exports = (req, res, next) => {

    return Promise.resolve()
        .then(() => {

            return req.box.getMeta();

        })
        .then(res.send.bind(res))
        .catch(next);

};

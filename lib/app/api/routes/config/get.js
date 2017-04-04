'use strict';

module.exports = (req, res, next) => {

    const config = require('app/config');

    let conf = {
        'registration': {
            'enabled': config.get('registration:enabled')
        }
    };

    return res.send(conf);

};

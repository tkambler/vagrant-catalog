'use strict';

const confit = require('confit');
const Promise = require('bluebird');
const handlers = require('shortstop-handlers');
const concatHandler = require('shortstop-concat');

module.exports = function(configDir) {
    let config = Promise.promisifyAll(confit({
        'basedir': configDir,
        'protocols': {
            'require': handlers.require(configDir),
            'path': handlers.path(configDir),
            'glob': handlers.glob(configDir),
            'env': handlers.env(),
            'concat': concatHandler(configDir, {
                'require': handlers.require(configDir),
                'path': handlers.path(configDir)
            })
        }
    }));
    return config.createAsync()
        .then((conf) => {
            module.exports = conf;
            return conf;
        });
};

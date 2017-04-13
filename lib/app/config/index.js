'use strict';

const confit = require('confit');
const Promise = require('bluebird');
const handlers = require('shortstop-handlers');
const concatHandler = require('shortstop-concat');
const shortstopRegex = require('shortstop-regex');

function getConfit(configDir) {
    return Promise.promisifyAll(confit({
        'basedir': configDir,
        'protocols': {
            'require': handlers.require(configDir),
            'path': handlers.path(configDir),
            'glob': handlers.glob(configDir),
            'env': handlers.env(),
            'regex': shortstopRegex(),
            'concat': concatHandler(configDir, {
                'require': handlers.require(configDir),
                'path': handlers.path(configDir)
            })
        }
    }));
}

module.exports = function(configDir) {

//     const config = getConfit(configDir);
//     config.addOverride(path.resolve(configDir, 'meddleware.json'));
//     return config.createAsync()
//         .then((conf) => {
//             module.exports = conf;
//             return conf;
//         });

    return getConfit(configDir)
        .createAsync()
        .then((conf) => {
            module.exports = conf;
            return conf;
        });

};

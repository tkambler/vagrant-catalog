'use strict';

const path = require('path');
const _ = require('lodash');

_.defaults(process.env, {
    'PORT': 9000
});

require('app/config')(path.resolve(__dirname, '../boxes'))
    .then((config) => {
        return require('app/api');
    });

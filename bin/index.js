'use strict';

const path = require('path');
const _ = require('lodash');

_.defaults(process.env, {
    'PORT': 9000
});

require('app/config')(path.resolve(__dirname, '../config'))
    .then(() => {
        return require('app/knex')();
    })
    .then(() => {
        return require('app/api');
    });

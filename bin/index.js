'use strict';

const path = require('path');

require('app/config')(path.resolve(__dirname, '../config'))
    .then((config) => {
        return require('app/api');
    });

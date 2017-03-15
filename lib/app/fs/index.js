'use strict';

const Promise = require('bluebird');
const fs = require('fs-extra');
module.exports = Promise.promisifyAll(fs);

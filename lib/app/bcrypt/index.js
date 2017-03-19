'use strict';

const Promise = require('bluebird');
const bcrypt = require('bcrypt');
module.exports = Promise.promisifyAll(bcrypt);

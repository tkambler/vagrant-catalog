'use strict';

const bcrypt = require('app/bcrypt');
const Bookshelf = require('app/bookshelf');

const Box = require('app/models/base').extend({

    'tableName': 'boxes',

    'versions': function() {
        return this.hasMany(require('../box-version'));
    }

});

module.exports = Box;

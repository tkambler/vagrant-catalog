'use strict';

const bcrypt = require('app/bcrypt');
const Bookshelf = require('app/bookshelf');

const BoxVersionProvider = require('app/models/base').extend({

    'tableName': 'box_version_providers',

    'version': function() {
        return this.belongsTo(require('../box-version'));
    }

});

module.exports = BoxVersionProvider;

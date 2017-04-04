'use strict';

const bcrypt = require('app/bcrypt');
const Bookshelf = require('app/bookshelf');

const BoxVersion = require('app/models/base').extend({

    'tableName': 'box_versions',

    'box': function() {
        return this.belongsTo(require('../box'));
    },

    'providers': function() {
        return this.hasMany(require('../box-provider'));
    }

});

module.exports = BoxVersion;

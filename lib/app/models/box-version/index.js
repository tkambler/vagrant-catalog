'use strict';

const bcrypt = require('app/bcrypt');
const Bookshelf = require('app/bookshelf');
const Base = require('app/models/base');

const BoxVersion = Base.extend({

    'tableName': 'box_versions',

    'box': function() {
        return this.belongsTo(require('../box'));
    },

    'providers': function() {
        return this.hasMany(require('../box-version-provider'));
    },

    'destroy': function() {
        return this.load('providers')
            .then(() => {
                return this.related('providers').toArray();
            })
            .each((provider) => {
                console.log('destroying provider');
                return provider.destroy();
            })
            .then(() => {
                return Base.prototype.destroy.apply(this, arguments);
            });
    }

});

module.exports = BoxVersion;

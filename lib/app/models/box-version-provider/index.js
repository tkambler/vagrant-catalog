'use strict';

const bcrypt = require('app/bcrypt');
const Bookshelf = require('app/bookshelf');
const path = require('path');
const config = require('app/config');
const fs = require('app/fs');
const Base = require('app/models/base');

const BoxVersionProvider = Base.extend({

    'tableName': 'box_version_providers',

    'version': function() {
        return this.belongsTo(require('../box-version'));
    },

    'getFileFolder': function() {
        return path.resolve(config.get('boxes_path'), 'providers');
    },

    'getFilePath': function() {
        if (!this.get('file')) throw new Error(`No value for 'file'`);
        return path.resolve(this.getFileFolder(), this.get('file'));
    },

    'destroy': function() {

        return fs.unlinkAsync(this.getFilePath())
            .then(() => {
                return Base.prototype.destroy.apply(this, arguments);
            });

    }

});

module.exports = BoxVersionProvider;

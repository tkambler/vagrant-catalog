'use strict';

const bcrypt = require('app/bcrypt');
const Bookshelf = require('app/bookshelf');
const config = require('app/config');
const Promise = require('bluebird');

const Box = require('app/models/base').extend({

    'tableName': 'boxes',

    'user': function() {
        return this.belongsTo(require('../user'));
    },

    'versions': function() {
        return this.hasMany(require('../box-version'));
    },

    'getMeta': function() {

        const meta = {
            'description': this.get('description'),
            'versions': []
        };

        return this.load(['versions', 'versions.providers'])
            .then(() => {
                return this.related('versions').toArray();
            })
            .each((version) => {

                const entry = {
                    'version': version.get('version'),
                    'providers': []
                };

                return Promise.resolve(version.related('providers').toArray())
                    .each((provider) => {
                        entry.providers.push({
                            'name': provider.get('name'),
                            'file': provider.get('original_filename'),
                            'checksum': provider.get('checksum')
                        });
                    })
                    .then(() => {
                        meta.versions.push(entry);
                    });

            })
            .return(meta);

    }

});

module.exports = Box;

'use strict';

const bcrypt = require('app/bcrypt');
const Bookshelf = require('app/bookshelf');
const config = require('app/config');
const Promise = require('bluebird');
const Base = require('app/models/base');

const Box = Base.extend({

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

        return this.load(['user', 'versions', 'versions.providers'])
            .then(() => {
                meta.name = `${this.related('user').get('username')}/${this.get('name')}`;
                return this.related('versions').toArray();
            })
            .each((version) => {

                const entry = {
                    'version': version.get('version'),
                    'providers': []
                };

                return Promise.resolve(version.related('providers').toArray())
                    .each((provider) => {
                        let downloadUrl = `${config.get('base_url')}/api/providers/${provider.id}/download`;
                        entry.providers.push({
                            'name': provider.get('name'),
                            'url': downloadUrl,
                            'checksum': provider.get('checksum'),
                            'checksum_type': 'sha256'
                        });
                    })
                    .then(() => {
                        meta.versions.push(entry);
                    });

            })
            .return(meta);

    },

    'destroy': function() {
        return this.load('versions')
            .then(() => {
                return this.related('versions').toArray();
            })
            .each((version) => {
                return version.destroy();
            })
            .then(() => {
                return Base.prototype.destroy.apply(this, arguments);
            });
    }

});

module.exports = Box;

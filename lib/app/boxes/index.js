'use strict';

const Promise = require('bluebird');
const fs = require('app/fs');
const config = require('app/config');
const checksum = require('app/checksum');
const path = require('path');
const _ = require('lodash');

module.exports = {

    'getBoxes': function(org) {

        const boxesPath = this.getBoxesPath(org);
        return fs.readdirAsync(boxesPath)
            .map((p) => {
                return path.resolve(boxesPath, p);
            })
            .filter((p) => {
                return fs.statAsync(p)
                    .then((stats) => {
                        return stats.isDirectory();
                    });
            })
            .map((p) => {
                return path.basename(p);
            });

    },

    'getBox': function(org, name) {

        return Promise.resolve()
            .then(() => {
                return fs.readJSONAsync(this.getBoxPath(org, name, 'meta.json'));
            })
            .then((box) => {
                box.name = `${org}/${name}`;
                return this.parseVersions(box, org, name, box.versions)
                    .then((versions) => {
                        box.versions = versions;
                    })
                    .return(box);
            });

    },

    'deleteBox': function(org, name) {

        return fs.removeAsync(this.getBoxPath(org, name));

    },

    'createBox': function(org, name, description) {

        return this.getBox(org, name)
            .catch(() => {
                // Box does not exist
                return undefined;
            })
            .then((box) => {

                if (box) throw new Error(`Box already exists: ${org/name}`);

                return fs.emptyDirAsync(this.getBoxPath(org, name));

            })
            .then(() => {

                return fs.writeFileAsync(this.getBoxPath(org, name, 'meta.json'), JSON.stringify({
                    'description': description || '',
                    'versions': []
                }, null, 4));

            })
            .then(() => {

                return this.getBox(org, name);

            });

    },

    'createVersion': function(org, name, version) {

        return Promise.resolve()
            .then(() => {
                return fs.readJSONAsync(this.getBoxPath(org, name, 'meta.json'));
            })
            .then((box) => {

                let existing = _.find(box.versions, {
                    'version': version
                });

                if (existing) {
                    throw new Error(`Box version already exists: ${version}`);
                }

                box.versions.push({
                    'version': version,
                    'providers': []
                });

                return this.saveBox(org, name, box);

            });

    },

    'deleteVersion': function(org, name, version) {

        return Promise.resolve()
            .then(() => {
                return fs.readJSONAsync(this.getBoxPath(org, name, 'meta.json'));
            })
            .then((box) => {

                let existing = _.find(box.versions, {
                    'version': version
                });

                if (!existing) {
                    throw new Error(`Box version does not exist: ${version}`);
                }

                return Promise.resolve(existing.providers)
                    .each((provider) => {
                        return fs.unlinkAsync(this.getBoxPath(org, name, provider.name, provider.file));
                    })
                    .then(() => {
                        box.versions = _.without(box.versions, existing);
                        return this.saveBox(org, name, box);
                    });

            });

    },

    'addVersionProvider': function(org, name, version, providerName, newBox) {

        return Promise.resolve()
            .then(() => {
                return fs.readJSONAsync(this.getBoxPath(org, name, 'meta.json'));
            })
            .then((box) => {

                let existing = _.find(box.versions, {
                    'version': version
                });

                if (!existing) {
                    throw new Error(`Box version does not exist: ${version}`);
                }

                let provider = _.find(version.providers, {
                    'name': providerName
                });

                if (provider) {
                    throw new Error(`Provider already exists: ${providerName}`);
                }

                console.log('providerName', providerName);
                console.log('newBox', newBox);

                return checksum.fileAsync(newBox.path, {
                    'algorithm': 'sha256'
                })
                    .then((cs) => {
                        return fs.renameAsync(newBox.path, this.getBoxPath(org, name, providerName, newBox.filename))
                            .then(() => {
                                provider = {
                                    'name': providerName,
                                    'file': newBox.filename,
                                    'checksum': cs
                                };
                                existing.providers.push(provider);
                                return this.saveBox(org, name, box);
                            });
                    });

            });

    },

    'saveBox': function(org, name, data) {

        let dest = this.getBoxPath(org, name, 'meta.json');
        return fs.writeFileAsync(dest, JSON.stringify(data, null, 4), 'utf8')
            .return(data);

    },

    'getBoxFileStream': function(org, name, provider, file) {

        let filePath = this.getBoxPath(org, name, provider, file);
        return fs.statAsync(filePath)
            .then((stats) => {
                return {
                    'stream': fs.createReadStream(filePath),
                    'size': stats.size
                };
            });

    },

    'getBoxesPath': function(org, ...args) {
        const pathArgs = [config.get('boxes_path'), org].concat(args);
        return path.resolve.apply(path, pathArgs);
    },

    'getBoxPath': function(org, name, ...args) {
        const pathArgs = [config.get('boxes_path'), org, name].concat(args);
        return path.resolve.apply(path, pathArgs);
    },

    'parseVersions': function(box, org, name, versions) {
        versions = versions || [];
        return Promise.resolve(versions)
            .each((version) => {
                return Promise.resolve(version.providers)
                    .map((provider) => {
                        return this.parseVersionProvider(box, org, name, provider);
                    });
            })
            .return(versions);
    },

    'parseVersionProvider': function(box, org, name, provider) {
        return Promise.resolve(provider)
            .then((provider) => {
                provider.url = `${config.get('base_url')}/api/boxes/${org}/${name}/${provider.name}/${provider.file}`;
                provider.checksum_type = 'sha256';
                if (provider.checksum) {
                    delete provider.file;
                    return provider;
                }
                return checksum.fileAsync(this.getBoxPath(org, name, provider.name, provider.file), {
                    'algorithm': 'sha256'
                })
                    .then((cs) => {
                        provider.checksum = cs;
                        delete provider.file;
                    })
                    .return(provider);
            });
    }

};

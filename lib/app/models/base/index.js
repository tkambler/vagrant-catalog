'use strict';

const bookshelf = require('app/bookshelf');
const Promise = require('bluebird');
const _ = require('lodash');

const BaseModel = bookshelf.Model.extend({

    'constructor': function() {

        this._lazyLoadTracker = {};
        this._lazyLoadInFlight = {};

        bookshelf.Model.apply(this, arguments);

    },

    'load': function() {
        let args = _(arguments).toArray().flatten().value();
        args.forEach((arg) => {
            this._lazyLoadInFlight[arg] = true;
        });
        return bookshelf.Model.prototype.load.apply(this, arguments)
            .then((res) => {
                args.forEach((arg) => {
                    this.trigger('loaded_' + arg);
                    delete this._lazyLoadInFlight[arg];
                    this._lazyLoadTracker[arg] = true;
                });
                return res;
            });
    },

    'lazyLoad': function() {
        let relationships = _(arguments)
            .toArray()
            .map((arg) => {
                return _.isArray(arg) ? arg : [arg];
            })
            .flatten()
            .value();
        return Promise.map(relationships, (relationship) => {
            let haz = (this._lazyLoadTracker[relationship] || this.relations[relationship]) ? true : false;
            if (haz) {
                return;
            } else if (this._lazyLoadInFlight[relationship]) {
                return new Promise((resolve, reject) => {
                    this.once('loaded_' + relationship, () => {
                        return resolve();
                    });
                });
            } else {
                return this.load(relationship);
            }
        });
    }

});

module.exports = BaseModel;

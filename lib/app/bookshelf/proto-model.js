'use strict';

var Promise = require('bluebird');

module.exports = function(bookshelf, knex) {

    var save = bookshelf.Model.prototype.save;
    bookshelf.Model.prototype.save = function() {
        return save.apply(this, arguments).then(function(model) {
            return new Promise(function(resolve, reject) {
                knex(model.tableName).where({
                    'id': model.get('id')
                }).limit(1).then(function(result) {
                    model.set(result[0]);
                    model.trigger('refetched');
                    resolve(model);
                }).catch(function(err) {
                    reject(err);
                });
            });
        });
    };

};

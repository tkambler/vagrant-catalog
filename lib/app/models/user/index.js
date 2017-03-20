'use strict';

const bcrypt = require('app/bcrypt');
const Bookshelf = require('app/bookshelf');

const User = require('app/models/base').extend({

    'tableName': 'users',

    'toJSON': function() {
        let data = Bookshelf.Model.prototype.toJSON.apply(this, arguments);
        delete data.password_hash;
        return data;
    },

    'validatePassword': function(password) {
        return bcrypt.compareAsync(password, this.get('password_hash'))
            .then((data) => {
                if (!data) throw new Error(`Unable to validate password.`);
            })
            .return(this);
    }

}, {

    'hashPassword': function(password) {
        return bcrypt.hashAsync(password, 10);
    }

});

module.exports = User;

'use strict';

const app = require('app');

app.factory('registration', function(Restangular) {

    return {
        'register': function(data) {
            return Restangular.all('users').customPUT(data, 'register');
        }
    };

});

'use strict';

const app = require('app');

app.factory('users', function(Restangular) {

    return Restangular.service('users');

});

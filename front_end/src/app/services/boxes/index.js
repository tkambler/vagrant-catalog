'use strict';

const app = require('app');

app.factory('boxes', function(Restangular) {

    return Restangular.service('boxes');

});

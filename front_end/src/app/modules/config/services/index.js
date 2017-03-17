'use strict';

const config = angular.module('config');

config.factory('config', function(Restangular) {

    return Restangular.one('config').get();

});

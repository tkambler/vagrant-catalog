'use strict';

const angular = require('angular');

const app = module.exports = angular.module('app', [
    'restangular'
]);

app.run(($log) => {
    $log.debug('app is running');
});

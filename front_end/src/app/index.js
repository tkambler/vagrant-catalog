'use strict';

const angular = require('angular');
const bulk = require('bulk-require');
const _ = require('lodash');

bulk(__dirname, ['modules/*']);

const app = module.exports = angular.module('app', [
    'config',
    'restangular',
    'ui.router',
    'validation.match',
    'ngSanitize',
    'ui.bootstrap',
    'notify'
]);

bulk(__dirname, ['services/*', 'directives/*']);

app.config(function($stateProvider, $urlRouterProvider, RestangularProvider) {

    RestangularProvider.setBaseUrl('/api');

    RestangularProvider.setResponseExtractor((response) => {
        let newResponse = response;
        if (angular.isArray(response)) {
            angular.forEach(newResponse, (value, key) => {
            newResponse[key].originalElement = angular.copy(value);
        });
        } else {
            newResponse.originalElement = angular.copy(response);
        }
        return newResponse;
    });

    const states = bulk(__dirname, ['states/*']).states;

    _.each(states, (state, name) => {
        _.defaults(state, {
            'name': name
        });
        return $stateProvider.state(state);
    });

    $urlRouterProvider.otherwise('/login');

});

app.run(($log) => {
    $log.debug('app is running');
});

'use strict';

const angular = require('angular');
const bulk = require('bulk-require');
const _ = require('lodash');

bulk(__dirname, ['modules/*']);

const app = module.exports = angular.module('app', [
    'config',
    'restangular',
    'ui.router',
]);

app.config(function($stateProvider, $urlRouterProvider, RestangularProvider) {

    RestangularProvider.setBaseUrl('/api');

    const states = [
        {
            'name': 'login',
            'url': '/login',
            'resolve': {
                'config': ['config', function(config) {
                    return config;
                }]
            },
            'controller': function($log, $scope, config) {
                $scope.registration_enabled = _.get(config, 'registration.enabled');
            },
            'template': `

<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">Sign In</h3>
  </div>
  <div class="panel-body">

    <div class="row">
        <div class="col-xs-6">

<form>
  <div class="form-group">
    <label for="username">Username</label>
    <input type="text" class="form-control" id="username" placeholder="Username">
  </div>
  <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
  </div>
  <button type="submit" class="btn btn-primary">Sign In</button>
  <button type="submit" class="btn btn-link" ng-if="registration_enabled">No Account? Register Here</button>
</form>

        </div>
        <div class="col-xs-6">
        </div>
    </div>

  </div>
  <div class="panel-footer">
  </div>
</div>

            `
        }
    ];

    states.forEach((state) => {
        return $stateProvider.state(state.name, state);
    });

    $urlRouterProvider.otherwise('/login');

});

app.run(($log) => {
    $log.debug('app is running');
});

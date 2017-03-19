'use strict';

const _ = require('lodash');

module.exports = {
    'name': 'register',
    'url': '/register',
    'resolve': {
        'config': ['config', function(config) {
            return config;
        }]
    },
    'controllerAs': '$ctrl',
    'controller': function($log, $scope, $state, config, registration) {

        if (!_.get(config, 'registration.enabled')) $state.go('login');

        this.model = {};

        this.register = () => {
            let data = _.cloneDeep(this.model);
            data.password = data.password1;
            delete data.password1;
            delete data.password2;
            return registration.register(data)
                .then(() => {
                    return $state.go('login');
                });
        };

    },
    'template': `

        <div class="row">

            <div class="col-xs-3"></div>
            <div class="col-xs-6">

                <div class="panel panel-default">
                    <div class="panel-heading">
                    <h3 class="panel-title">Register</h3>
                </div>

                <div class="panel-body">

                    <form name="registrationForm">

                        <div class="row">

                            <div class="form-group col-xs-6">
                                <label for="username">Username</label>
                                <input type="text" class="form-control" id="username" placeholder="Username" ng-model="$ctrl.model.username" required>
                            </div>

                            <div class="form-group col-xs-6">
                                <label for="email">Email Address</label>
                                <input type="text" class="form-control" id="email" placeholder="Email Address" ng-model="$ctrl.model.email" required>
                            </div>

                        </div>

                        <div class="row">

                            <div class="form-group col-xs-6">
                                <label for="first_name">First Name</label>
                                <input type="text" class="form-control" id="firstname" placeholder="First Name" ng-model="$ctrl.model.first_name" required>
                            </div>

                            <div class="form-group col-xs-6">
                                <label for="last_name">Last Name</label>
                                <input type="text" class="form-control" id="lastname" placeholder="Last Name" ng-model="$ctrl.model.last_name" required>
                            </div>

                        </div>

                        <div class="row">

                            <div class="form-group col-xs-6">
                                <label for="password1">Password</label>
                                <input type="password" class="form-control" id="password1" placeholder="Password" ng-model="$ctrl.model.password1" required>
                            </div>

                            <div class="form-group col-xs-6">
                                <label for="password2">Password (Confirm)</label>
                                <input type="password" class="form-control" id="password2" placeholder="Password" ng-model="$ctrl.model.password2" match="$ctrl.model.password1" required>
                                <p class="help-block" ng-show="registrationForm.$error.match">The passwords you have entered do not match.</p>
                            </div>

                        </div>

                        <div class="row">
                            <div class="col-xs-6">
                                <button type="submit" class="btn btn-primary" ng-click="$ctrl.register()" ng-disabled="!registrationForm.$valid">Register</button>
                            </div>
                        </div>

                    </form>

                </div>

                <div class="panel-footer"></div>

            </div>

            <div class="col-xs-3"></div>

        </div>

    `
};

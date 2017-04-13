'use strict';

module.exports = {
    'name': 'login',
    'url': '/login',
    'resolve': {
        'config': ['config', function(config) {
            return config;
        }]
    },
    'views': {
        'body': {
            'controllerAs': '$ctrl',
            'controller': function($log, $scope, $state, config, Restangular) {

                this.registration_enabled = _.get(config, 'registration.enabled');

                this.signIn = () => {
                    return Restangular.all('users')
                        .all('sessions')
                        .post(this.model)
                        .then((data) => {
                            return $state.go('boxes');
                        });
                };

                this.register = () => {
                    $state.go('register');
                };

            },
            'template': `

            <div class="vertical">

                <div class="row">

                    <div class="col-xs-4"></div>

                    <div class="col-xs-4">

                        <div class="panel panel-default">
                          <div class="panel-heading">
                            <h3 class="panel-title">Sign In</h3>
                          </div>
                          <div class="panel-body">

                            <div class="row">
                                <div class="col-xs-12">

                                    <form>

                                        <div class="form-group">
                                            <label for="username">Username</label>
                                            <input type="text" class="form-control" id="username" placeholder="Username" ng-model="$ctrl.model.username" auto-focus required>
                                        </div>

                                        <div class="form-group">
                                            <label for="password">Password</label>
                                            <input type="password" class="form-control" id="password" placeholder="Password" ng-model="$ctrl.model.password" required>
                                        </div>

                                        <button type="submit" class="btn btn-primary" ng-click="$ctrl.signIn()">Sign In</button>
                                        <button type="submit" class="btn btn-link" ng-if="$ctrl.registration_enabled" ng-click="$ctrl.register()">No Account? Register Here</button>

                                    </form>

                                </div>
                            </div>

                          </div>
                          <div class="panel-footer">
                          </div>
                        </div>

                    </div>

                    <div class="col-xs-4"></div>

                </div>

            </div>

            `
        }
    }
};

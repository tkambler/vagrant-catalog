'use strict';

const _ = require('lodash');
const fs = require('fs');

module.exports = {
    'name': 'boxes',
    'url': '/boxes',
    'resolve': {
        'config': ['config', function(config) {
            return config;
        }],
        'session': ['session', function(session) {
            return session;
        }]
    },
    'views': {
        'header': {
            'controllerAs': '$ctrl',
            'controller': function($log, config, session) {

                this.session = session;

            },
            'template': `

                <header session="$ctrl.session"></header>

            `
        },
        'body': {
            'resolve': {
                'config': ['config', function(config) {
                    return config;
                }],
                'session': ['session', function(session) {
                    return session;
                }],
                'boxes': ['session', 'users', function(session, users) {
                    return users.one(session.username).all('boxes').getList({
                        'withRelated': ['versions', 'versions.providers']
                    });
                }],
            },
            'controllerAs': '$ctrl',
            'controller': function($log, $scope, $state, config, Restangular, session, boxes, $uibModal, notify, upload) {

                this.session = session;

                this.deleteBox = (box) => {

                    return notify.prompt({
                        'text': `Are you sure you want to delete the following box?<br><br>${box.name}`,
                        'buttons': [
                            {
                                'text': 'No',
                                'addClass': 'btn btn-default',
                                'value': false
                            },
                            {
                                'text': 'Yes - Delete',
                                'addClass': 'btn btn-danger',
                                'value': true
                            }
                        ]
                    })
                        .then((val) => {

                            if (!val) return;

                            return boxes.one(box.name).remove()
                                .then(() => {
                                    notify.success(`Box ${box.name} has been deleted.`);
                                    return $state.reload();
                                });

                        });

                };

                this.deleteVersion = (box, version) => {

                    return notify.prompt({
                        'text': `Are you sure you want to delete version ${version.version} of the following box?<br><br>${box.name}`,
                        'buttons': [
                            {
                                'text': 'No',
                                'addClass': 'btn btn-default',
                                'value': false
                            },
                            {
                                'text': 'Yes - Delete',
                                'addClass': 'btn btn-danger',
                                'value': true
                            }
                        ]
                    })
                        .then((val) => {

                            if (!val) return;

                            return boxes.one(box.name).one('versions', version.id).remove()
                                .then(() => {
                                    notify.success(`Version ${version.version} of ${box.name} has been deleted.`);
                                    return $state.reload();
                                });

                        });

                };

                this.addProvider = (box, version) => {

                    return $uibModal.open({
                        'backdrop': 'static',
                        'controllerAs': '$ctrl',
                        'size': 'lg',
                        'controller': function($scope) {

                            this.file = null;
                            this.model = {};

                            this.close = () => {
                                return $scope.$close();
                            };

                            this.fileCallback = (file) => {
                                this.file = file;
                            };

                            this.submit = () => {

                                if (!this.file) return;

                                $scope.$close();

                                return upload.upload(`/api/users/${session.id}/boxes/${box.id}/versions/${version.id}/providers`, this.model, {
                                    'box': this.file
                                })
                                    .then((res) => {
                                        notify.success(`Provider "${this.model.name}" was added to version ${version.version} of the "${box.name}" box.`);
                                        $state.reload();
                                    });

                            };

                        },
                        'template': fs.readFileSync(__dirname + '/templates/add-version-provider.html', 'utf8')
                    });

                };

                this.createNewVersion = (box) => {

                    return $uibModal.open({
                        'backdrop': 'static',
                        'controllerAs': '$ctrl',
                        'controller': function($scope) {

                            this.model = {};

                            this.close = () => {
                                return $scope.$close();
                            };

                            this.submit = () => {
                                return boxes.customPOST(this.model, `${box.name}/versions`)
                                    .then(() => {
                                        return $scope.$close(this.model.version);
                                    });
                            };

                        },
                        'template': fs.readFileSync(__dirname + '/templates/create-version.html', 'utf8')
                    })
                        .result.then((version) => {
                            if (!version) return;
                            notify.success(`Version ${version} of ${box.name} created.`);
                            $state.reload();
                        });

                };

                this.deleteProvider = (box, version, provider) => {

                    return notify.prompt({
                        'text': `Are you sure you want to delete the "${provider.name}" provider for version ${version.version} of the following box?<br><br>${box.name}`,
                        'buttons': [
                            {
                                'text': 'No',
                                'addClass': 'btn btn-default',
                                'value': false
                            },
                            {
                                'text': 'Yes - Delete',
                                'addClass': 'btn btn-danger',
                                'value': true
                            }
                        ]
                    })
                        .then((val) => {

                            if (!val) return;

                            return boxes.one(box.name).one('versions', version.id).one('providers', provider.id).remove()
                                .then(() => {
                                    notify.success(`Version ${version.version} of ${box.name} has been deleted.`);
                                    return $state.reload();
                                });

                        });

                };

                boxes.forEach((box) => {
                    box.versions.forEach((version) => {
                        version.provider_names = _.map(version.providers, 'name').join(', ') || '-';
                    });
                });

                this.boxes = boxes;

            },
            'template': fs.readFileSync(__dirname + '/templates/boxes.html', 'utf8')
        }
    }
};

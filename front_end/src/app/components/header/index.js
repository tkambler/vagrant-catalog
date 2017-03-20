'use strict';

const app = require('app');
const fs = require('fs');

app.component('header', {
    'bindings': {
        'session': '<'
    },
    'template': fs.readFileSync(__dirname + '/templates/header.html', 'utf8'),
    'controller': function($log, $uibModal, notify, $state, Restangular) {

        this.$onInit = () => {
        };

        this.createBox = () => {

            return $uibModal.open({
                'backdrop': 'static',
                'component': 'createBox',
                'resolve': {
                    'session': () => {
                        return this.session;
                    }
                }
            })
                .result.then((box) => {

                    if (box) {
                        notify.success(`Box created: ${box.name}`);
                        $state.reload();
                    }

                });

        };

        this.signOut = () => {

            return Restangular.all('session')
                .remove()
                .then(() => {
                    return $state.go('login');
                });

            return this.session.remove()
                .then(() => {
                    return $state.go('login');
                });

        };

    }
});

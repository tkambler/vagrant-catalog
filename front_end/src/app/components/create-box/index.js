'use strict';

const app = require('app');
const fs = require('fs');

app.component('createBox', {
    'bindings': {
        'modalInstance': '<',
        'resolve': '<'
    },
    'controller': function($log, $scope, Restangular, notify) {

        this.$onInit = () => {

            $log.debug('modal', this);

            this.model = {};
            this.readOnly = false;

        };

        this.close = () => {
            return this.modalInstance.close();
        };

        this.submit = () => {
            this.readOnly = true;
            return Restangular.one('users', this.resolve.session.id)
                .all('boxes')
                .post(this.model)
                .then((res) => {
                    return this.modalInstance.close(res);
                })
                .catch((err) => {
                    this.readOnly = false;
                    return notify.error(err);
                });
        };

    },
    'template': `

<form name="form">

    <div class="modal-header">
        <h3 class="modal-title">Create Box</h3>
    </div>
    <div class="modal-body" id="modal-body">

        <div class="row">
            <div class="col-xs-12">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" class="form-control" id="name" name="name" auto-focus placeholder="box-name" ng-model="$ctrl.model.name" required ng-readonly="$ctrl.readOnly">
                </div>
            </div>
            <div class="col-xs-12">
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea class="form-control" id="description" name="description" placeholder="Description" ng-model="$ctrl.model.description" ng-readonly="$ctrl.readOnly"></textarea>
                </div>
            </div>
        </div>

    </div>
    <div class="modal-footer">
        <button class="btn btn-default" type="button" ng-click="$ctrl.close()">Close</button>
        <button class="btn btn-primary" type="submit" ng-disabled="!form.$valid || $ctrl.readOnly" ng-click="$ctrl.submit()">Create Box</button>
    </div>

</form>

    `
});

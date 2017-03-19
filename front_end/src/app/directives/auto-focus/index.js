'use strict';

const app = require('app');
const _ = require('lodash');

app.directive('autoFocus', function($timeout, $parse) {

    return {
        'link': {
            'post': function (scope, element, attrs) {
                _.defer(() => {
                    element.focus();
                });
            }
        }
    };

});

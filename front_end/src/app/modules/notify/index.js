'use strict';

const Promise = require('bluebird');
const noty = require('noty');
const $ = require('jquery');
const _ = require('lodash');
const mod = require('angular').module('notify', []);

const defaults = {
    'layout': 'top',
    'theme': 'defaultTheme',
    'modal': false
};

mod.factory('notify', function($log) {

    const api = {};
    const notificationTypes = [
        'alert', 'success', 'warning', 'error', 'information'
    ];

    notificationTypes.forEach((nType) => {
        api[nType] = (msg, options) => {
            options = _.isObject(options) ? options : {};
            _.defaults(options, {
                'timeout': 3000,
                'layout': 'top'
            });
            options.type = nType;
            if (_.isString(msg)) {
                options.text = msg;
            } else if (_.isString(msg.message)) {
                options.text = msg.message;
            } else if (_.get(msg, 'error')) {
                options.text = msg.error;
            } else if (_.get(msg, 'data.error')) {
                options.text = msg.data.error;
            } else if (_.get(msg, 'message')) {
                options.text = msg.message;
            } else {
                $log.error('Error processing notification', {
                    'msg': msg
                });
                options.text = 'Unknown Error';
            }
            return noty(options);
        };
    });

    api.prompt = (options) => {

        return new Promise((resolve, reject) => {

            _.defaults(options, {
                'buttons': []
            });

            options.buttons = options.buttons.map((button) => {
                if (_.isUndefined(button.value)) {
                    return reject(new Error(`button must have a value: ${JSON.stringify(button)}`));
                }
                button.onClick = () => {
                    return resolve(button.value);
                };
                return button;
            });

            options = _.extend(defaults, options);

            return noty(options);

        });

    };

    return api;

});

'use strict';

const app = require('app');
const _ = require('lodash');

app.factory('session', function(Restangular) {

    return Restangular.one('session').get();

//     class Session {
//
//         constructor() {
//             this.data = {};
//         }
//
//         get(k) {
//             return _.cloneDeep(_.get(this.data, k));
//         }
//
//         set(k, v) {
//             if (_.isObject(k)) {
//                 this.data = _.cloneDeep(k);
//             } else {
//                 _.set(this.data, k, _.cloneDeep(v));
//             }
//             return this;
//         }
//
//     }
//
//     return new Session();

});

'use strict';

const app = require('app');

app.factory('account', function(Restangular, session) {

    return Restangular.one('accounts', session.id);

});

'use strict';

module.exports = () => {

    const config = require('app/config');
    const knex = require('app/knex');
    const session = require('express-session');
    const KnexSessionStore = require('connect-session-knex')(session);
    const store = new KnexSessionStore({
        'knex': knex
    });

    return session({
        'secret': config.get('session:secret'),
        'store': store,
        'resave': true,
        'saveUninitialized': false
    });

};

'use strict';

var config = require('app/config');
var knex = require('knex')({
    'client': config.get('db:client'),
    'connection': config.get('db:connection'),
    'debug': config.get('db:debug'),
    'useNullAsDefault': true
});

module.exports = knex;

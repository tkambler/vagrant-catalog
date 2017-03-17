'use strict';

const angular = require('angular');
const config = module.exports = angular.module('config', ['restangular']);
const bulk = require('bulk-require');
bulk(__dirname, ['services/*']);

'use strict';

var knex = require('app/knex');
var bookshelf = require('bookshelf');
var protoModel = require('./proto-model');
bookshelf = bookshelf(knex);
bookshelf.plugin('virtuals');
bookshelf.plugin('pagination');
protoModel(bookshelf, knex);

module.exports = bookshelf;

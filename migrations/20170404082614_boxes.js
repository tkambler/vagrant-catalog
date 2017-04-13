'use strict';

exports.up = function(knex, Promise) {

    return knex.schema.createTable('boxes', function (table) {
        table.increments();
        table.integer('user_id').references('users.id').notNullable();
        table.string('name').notNullable();
        table.string('description');
        table.timestamps(true, true);
        table.unique(['user_id', 'name']);
    });

};

exports.down = function(knex, Promise) {

    return knex.schema.dropTable('boxes');

};

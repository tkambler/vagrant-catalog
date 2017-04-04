'use strict';

exports.up = function(knex, Promise) {

    return knex.schema.createTable('boxes', function (table) {
        table.increments();
        table.integer('user_id').references('users.id').notNullable();
        table.string('name').notNullable();
        table.timestamps(true, true);
    });

};

exports.down = function(knex, Promise) {

    return knex.schema.dropTable('boxes');

};

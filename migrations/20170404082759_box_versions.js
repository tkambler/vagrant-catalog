'use strict';

exports.up = function(knex, Promise) {

    return knex.schema.createTable('box_versions', function (table) {
        table.increments();
        table.integer('box_id').references('boxes.id').notNullable();
        table.string('version').notNullable();
        table.timestamps(true, true);
        table.unique(['box_id', 'version']);
    });

};

exports.down = function(knex, Promise) {

    return knex.schema.dropTable('box_versions');

};

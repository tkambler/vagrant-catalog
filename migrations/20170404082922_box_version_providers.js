'use strict';

exports.up = function(knex, Promise) {

    return knex.schema.createTable('box_version_providers', function (table) {
        table.increments();
        table.integer('box_version_id').references('box_versions.id').notNullable();
        table.string('name').notNullable();
        table.string('file').notNullable();
        table.string('original_filename').notNullable();
        table.string('checksum').notNullable();
        table.timestamps(true, true);
    });

};

exports.down = function(knex, Promise) {

    return knex.schema.dropTable('box_version_providers');

};

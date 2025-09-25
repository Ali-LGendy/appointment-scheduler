// migrations/20250920_create_availabilities.js
exports.up = function(knex) {
  return knex.schema.createTable('availabilities', function(table) {
    table.increments('id').primary();
    table.integer('provider_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.timestamp('start_ts').notNullable();
    table.timestamp('end_ts').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();

    table.index(['provider_id', 'start_ts'], 'availabilities_provider_start_idx');
  })
  .then(() => {
    return knex.raw(`
      ALTER TABLE availabilities
      ADD CONSTRAINT availabilities_end_after_start CHECK (end_ts > start_ts)
    `);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('availabilities');
};
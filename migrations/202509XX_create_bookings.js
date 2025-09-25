exports.up = function(knex) {
  return knex.schema.createTable('bookings', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.integer('availability_id').unsigned().notNullable()
      .references('id').inTable('availabilities').onDelete('CASCADE').unique();
    table.enu('status', ['pending', 'confirmed', 'cancelled']).notNullable().defaultTo('confirmed');
    table.timestamp('cancelled_at').nullable();
    table.integer('cancelled_by').unsigned().nullable()
      .references('id').inTable('users').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();

    table.index(['user_id'], 'bookings_user_idx');
    table.index(['availability_id'], 'bookings_availability_idx');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('bookings');
};
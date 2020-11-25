exports.up = function(knex) {
  return knex.schema.createTable('addresses', function(table) {
    table
      .uuid('id')
      .primary()
      .defaultTo(knex.raw('gen_random_uuid()'))
    table.string('dawa_id', 255)
    table.string('name', 255)
    table.string('postal_code', 255)
    table.string('city', 255)
    table.string('street', 255)
    table.string('number', 255)
    table.string('floor', 255)
    table.string('extra', 255)
    table.decimal('lng', 10, 8)
    table.decimal('lat', 10, 8)
    table.string('matrikelnr', 255)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('addresses')
}

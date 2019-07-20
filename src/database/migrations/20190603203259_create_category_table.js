
// @ts-ignore
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('category', (table) => {
      table.increments('id')
      table.string('Name')
    })
}

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('category')
}

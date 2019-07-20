
// @ts-ignore
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('setting', (table) => {
      table.increments('id')
      table.string('name')
      table.string('value')
    })
}

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('setting')
}

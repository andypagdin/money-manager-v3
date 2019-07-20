
// @ts-ignore
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('transaction', (table) => {
      table.increments('id')
      table.date('Date')
      table.string('Type')
      table.string('Description')
      table.decimal('Value')
      table.decimal('Balance')
      table.string('AccountName')
      table.string('AccountNumber')
      table.integer('categoryId').unsigned()
      table.foreign('categoryId').references('id').inTable('category')
    })
}

exports.down = function(knex, Promise) {
  return knex.schema
      .dropTable('transaction')
}

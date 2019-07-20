
// @ts-ignore
exports.seed = function(knex, Promise) {
  return knex('setting').del()
    .then(function () {
      return knex('setting').insert([
        {id: 1, name: 'waterSupplier', value: 'UNITED UTIL WATER'},
        {id: 2, name: 'energySupplier', value: 'SPARK ENERGY'}
      ])
    })
}

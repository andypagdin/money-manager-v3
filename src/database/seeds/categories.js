
// @ts-ignore
exports.seed = function(knex, Promise) {
  return knex('category').del()
    .then(function () {
      return knex('category').insert([
        {id: 1, Name: 'Groceries'},
        {id: 2, Name: 'Bills'},
        {id: 3, Name: 'Entertainment'},
        {id: 4, Name: 'Eating Out'},
        {id: 5, Name: 'Transport'},
        {id: 6, Name: 'Shopping'},
        {id: 7, Name: 'Other'},
        {id: 8, Name: 'Income'},
        {id: 9, Name: 'Savings'}        
      ])
    })
}

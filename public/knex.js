// @ts-ignore
const path = require('path')
const fs = require('fs')
const isDev = require('electron-is-dev')

let seedsPath = isDev 
  ? './src/database/seeds'
  : path.join(__dirname, '../src/database/seeds').replace('/app.asar', '')

module.exports = {
  setup: (database, appData) => {
    async function checkFiles() {
      try {
        fs.openSync(path.join(appData, 'money-manager/database.sqlite'), 'a')
      } catch (err) {
        console.log('Error checking files!', err)
      }
      console.log('Checked files')
    }
  
    async function checkConnection() {
      return database.raw('select 1+1 as result')
        .then(() => {
          console.log('Connection established')
        })
        .catch((err) => {
          console.log('Error checking connection!', err)
        })
    }
  
    async function runMigrations() {
      database.migrate.latest()
        .then(() => {
          console.log('Migrations ran')
          runSeeds()
        })
    }

    function runSeeds() {
      database.seed.run({directory: seedsPath})
        .then(console.log('Seeds ran'))
    }
  
    async function init() {
      await checkFiles()
      await checkConnection()
      await runMigrations()
    }
  
    init()
  }
}
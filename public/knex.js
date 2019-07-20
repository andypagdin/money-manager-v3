// @ts-ignore
const path = require('path')
const fs = require('fs')
const isDev = require('electron-is-dev')

let knex
let seedsPath
let migrationsPath
let connectionPath

module.exports = {
  database: knex,
  setup: (appData) => {
    async function initPaths() {
      connectionPath = path.join(appData, 'money-manager/database.sqlite')
      migrationsPath = path.join(__dirname, '../src/database/migrations')
      seedsPath = './src/database/seeds'
      
      if (!isDev) {
        migrationsPath = path.join(__dirname, '../src/database/migrations').replace('/app.asar', '')
        seedsPath = path.join(__dirname, '../src/database/seeds').replace('/app.asar', '')
      }
      
      knex = require('knex')({
        client: 'sqlite3',
        useNullAsDefault: true,
        connection: {
          filename: connectionPath
        },
        migrations: {
          directory: migrationsPath
        }
      })
    }

    async function checkFiles() {
      try {
        fs.openSync(connectionPath, 'a')
      } catch (err) {
        console.log('Error checking files!', err)
      }
      console.log('Checked files')
    }
  
    async function checkConnection() {
      return knex.raw('select 1+1 as result')
        .then(() => {
          console.log('Connection established')
        })
        .catch((err) => {
          console.log('Error checking connection!', err)
        })
    }
  
    async function runMigrations() {
      knex.migrate.latest()
        .then(() => {
          console.log('Migrations ran')
          runSeeds()
        })
    }

    function runSeeds() {
      knex.seed.run({directory: seedsPath})
        .then(console.log('Seeds ran'))
    }
  
    async function init() {
      await initPaths()
      await checkFiles()
      await checkConnection()
      await runMigrations()
    }
  
    init()
  }
}
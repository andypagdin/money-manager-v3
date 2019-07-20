const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const knex = require('./knex')
const moment = require('moment')
const bayes = require('bayes')
const fs = require('fs')

const classifierUtilsPath = isDev
  ? '../src/classifier/classifierUtils'
  : path.join(__dirname, '../src/classifier/classifierUtils').replace('/app.asar', '')
const classifierUtils = require(classifierUtilsPath)

let win
const migrationsPath = isDev 
  ? path.join(__dirname, '../src/database/migrations') 
  : path.join(__dirname, '../src/database/migrations').replace('/app.asar', '')

const database = require('knex')({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: path.join(app.getPath('appData'), 'money-manager/database.sqlite')
  },
  migrations: {
    directory: migrationsPath
  }
})

function createWindow() {
  win = new BrowserWindow({ 
    width: 900, 
    height: 680,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/preload.js'
    }
  })

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )

  win.on('closed', () => (win = null))

  win.webContents.openDevTools()

  async function train() {
    await classifierUtils.trainClassifier(bayes)
  }
  
  async function make() {
    await classifierUtils.makeInitialClassifier(bayes)
  }
  
  if (process.env.TRAIN_CLASSIFIER) {
    train()
      .then(() => app.quit())
      .catch(err => console.log(err))
  }
  else if (process.env.MAKE_CLASSIFIER) {
    make()
      .then(() => app.quit())
      .catch(err => console.log(err))
  }
  else if (process.env.MAKE_TRAIN_CLASSIFIER) {
    make()
      .then(() => train())
      .then(() => app.quit())
      .catch(err => console.log(err))
  }
  else {
    knex.setup(database, app.getPath('appData'))
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('update-category', (event, transactionId, categoryId) => {
  database('transaction')
    .where('id', '=', transactionId)
    .update({ categoryId: categoryId })
    .then(() => {
      event.returnValue = true
    })
    .catch((err) => {
      console.log(err)
      event.returnValue = false
    })
})

ipcMain.on('insert-query', (event, table, data) => {
  database(table)
    .insert(data)
    .then(() => {
      event.returnValue = true
    })
    .catch((err) => {
      console.log(err)
      event.returnValue = false
    })
})

ipcMain.on('get-transactions', (event, month) => {
  const currentMonth = moment(month)
  const minDate = currentMonth.startOf('month').format('YYYY-MM-DD')
  const maxDate = currentMonth.endOf('month').format('YYYY-MM-DD')

  database.select(
      't.id',
      't.Value', 
      't.Date', 
      't.Type', 
      't.Description', 
      't.Balance', 
      't.AccountName', 
      't.AccountNumber', 
      'category.Name AS categoryName')
    .from('transaction as t')
    .join('category', 't.categoryId', '=', 'category.id')
    .whereBetween('t.Date', [minDate, maxDate])
    .then((results) => {
      event.returnValue = results
    })
    .catch((err) => {
      console.log(err)
      event.returnValue = []
    })
})

ipcMain.on('get-settings', (event) => {
  database.select('*')
    .from('setting')
    .then((results) => {
      event.returnValue = results
    })
    .catch((err) => {
      console.log(err)
      event.returnValue = []
    })
})

ipcMain.on('get-categories', (event) => {
  database.select('*')
    .from('category')
    .then((results) => {
      event.returnValue = results
    })
    .catch((err) => {
      console.log(err)
      event.returnValue = []
    })
})

ipcMain.on('update-setting', (event, setting) => {
  database('setting')
    .where('name', '=', setting.name)
    .update('value', setting.value)
    .then((updatedRows) => {
      event.returnValue = updatedRows
    })
    .catch((err) => {
      console.log(err)
      event.returnValue = 0
    })
})

ipcMain.on('get-bills-settings', (event) => {
  database.select('*')
    .from('setting')
    .where('name', '=', 'waterSupplier')
    .orWhere('name', '=', 'energySupplier')
    .then((results) => {
      event.returnValue = results
    })
    .catch((err) => {
      console.log(err)
      event.returnValue = []
    })
})

ipcMain.on('classify-transactions', (event, transactions) => {  
  database.select('*')
    .from('category')
    .then((categories) => {
      classify(categories)
    })
    .catch((err) => {
      console.log(err)
    })

  function classify(categories) {
    const json = isDev
      ? fs.readFileSync(path.join(__dirname, '../src/classifier/classifier.json'), 'utf8')
      : fs.readFileSync(path.join(__dirname, '../src/classifier/classifier.json').replace('/app.asar', ''), 'utf8')
    let classifier = bayes.fromJson(json)
  
    for (let i = 0; i < transactions.length; i++) {
      let transaction = transactions[i]

      if (transaction.Value > 0) {
        transaction.categoryId = categories.find(cat => cat.Name === 'Income').id
        continue
      }

      // If it isnt POS or D/D the chances of making an accurate classification are pretty slim so put into 'Other'
      if (transaction.Type != 'POS' && transaction.Type != 'D/D') {
        continue
      }

      let descriptionArr = transaction.Description.toLowerCase().split(',')
      let description = transaction.Type === 'POS' ? descriptionArr[1].trim() : descriptionArr[0].trim()
  
      let category = classifier.categorize(description)
      transaction.categoryId = categories.find(cat => cat.Name === category).id
    }

    event.returnValue = transactions
  }
})
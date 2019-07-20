const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const knex = require('./knex')
const moment = require('moment')
const bayes = require('bayes')
const classifierUtils = require('../src/classifier/classifierUtils')
const fs = require('fs')

let win

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
    await classifierUtils.trainClassifier()
  }
  
  async function make() {
    await classifierUtils.makeInitialClassifier()
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
    knex.setup(app.getPath('appData'))
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
  knex.database('transaction')
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
  knex.database(table).insert(data)
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

  console.log(knex.database)

  knex.database('transaction AS t')
    .select(
      't.id',
      't.Value', 
      't.Date', 
      't.Type', 
      't.Description', 
      't.Balance', 
      't.AccountName', 
      't.AccountNumber', 
      'category.Name AS categoryName')
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
  knex.database('setting')
    .then((results) => {
      event.returnValue = results
    })
    .catch((err) => {
      console.log(err)
      event.returnValue = []
    })
})

ipcMain.on('get-categories', (event) => {
  knex.database('category')
    .then((results) => {
      event.returnValue = results
    })
    .catch((err) => {
      console.log(err)
      event.returnValue = []
    })
})

ipcMain.on('update-setting', (event, setting) => {
  knex.database('setting')
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
  knex.database('setting')
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
  knex.database('category')
    .then((categories) => {
      classify(categories)
    })
    .catch((err) => {
      console.log(err)
    })

  function classify(categories) {
    const json = fs.readFileSync(path.resolve(__dirname + '/classifier/classifier.json'), 'utf8')
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
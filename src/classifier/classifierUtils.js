// @ts-ignore
const bayes = require('bayes')
const fs = require('fs')
const path = require('path')

/**
 * Used in development to create an empty classifier
 * the resulting classifier should be kept in version control and updated as it learns
 */
function makeInitialClassifier() {
  return new Promise((resolve, reject) => {
    let classifier = bayes()

    classifier.learn('spark', 'Bills')
    classifier.learn('tesco', 'Groceries')

    let stateJson = classifier.toJson()

    fs.writeFile(path.resolve(__dirname + '/classifier.json'), stateJson, err => {
      if (err) {
        reject(err)
      }
      else {
        console.log('Classifier Created')
        resolve()
      }
    })
  })
}

function trainClassifier() {
  return new Promise((resolve, reject) => {
    const data = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/trainingData.json'), 'utf8'))
    const classifierJson = fs.readFileSync(path.resolve(__dirname + '/classifier.json'), 'utf8')
    let classifier = bayes.fromJson(classifierJson)

    for (let key in data) {
      classifier.learn(data[key], key)
    }

    fs.writeFile(path.resolve(__dirname + '/classifier.json'), classifier.toJson(), err => {
      if (err) {
        reject(err)
      }
      else {
        console.log('Classifier Trained')
        resolve()
      }
    })
  })
}

function returnCategoryColours() {
  return {
    Groceries: '#3EDC81',
    Bills: '#37DBD0',
    Entertainment: '#22A7F0',
    'Eating Out': '#AB69C6',
    Transport: '#FF6CA8',
    Shopping: '#FF7C6C',
    Other: '#F9B32F'
  }
}

module.exports = {
  makeInitialClassifier: makeInitialClassifier,
  trainClassifier: trainClassifier,
  returnCategoryColours: returnCategoryColours
}
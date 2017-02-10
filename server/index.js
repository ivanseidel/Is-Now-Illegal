const fs = require('fs')
const path = require('path')
const express = require('express')

const admin = require('firebase-admin')
const storage = require('@google-cloud/storage')

const PathLoader = require('./PathLoader')

// Expose global app object
var app = {}
global.app = app

// Load credentials
var credentialsPath = path.join(__dirname, '../credentials.json')
var credentials = require(credentialsPath)

// Initialize tmp path
app.TMP_PATH = path.join(__dirname, '../tmp')
fs.existsSync(app.TMP_PATH) || fs.mkdirSync(app.TMP_PATH)

// Initialize Firebase connection
app.admin = admin
app.admin.initializeApp({
  credential: admin.credential.cert(credentials),
  databaseURL: 'https://is-now-illegal.firebaseio.com',
  databaseAuthVariableOverride: {
    uid: 'worker'
  }
})

// Initialize GCloud connection
app.gcs = storage({
  projectId: credentials.project_id,
  keyFilename: credentialsPath
})

//
// Start HTTP server
//
app.express = express()

app.express.get('/', (req, res) => {
  res.status(200).send('home')
})

app.express.get('/_ah/health', (req, res) => {
  res.status(200).send('OK ' + Date.now())
})

const PORT = process.env.PORT || 8080
app.express.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})

// Load tasks
app.TASKS = PathLoader.load(path.join(__dirname, 'tasks'))

// Load Firebase Queue
app.queueRef = app.admin.database().ref('queue')

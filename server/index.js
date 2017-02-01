var fs = require('fs')
var path = require('path')
var async = require('async')

var Queue = require('firebase-queue')
var admin = require('firebase-admin')
var storage = require('@google-cloud/storage');

var PathLoader = require('./PathLoader')
var GifGenerator = require('./GifGenerator')

// Expose global app object
var app = {}
global.app = app

// Load credentials
var credentialsPath = path.join(__dirname, '../credentials.json')
var credentials = require(credentialsPath)

// Initialize tmp path
app.TMP_PATH = path.join(__dirname, '../tmp')
if (!fs.existsSync(app.TMP_PATH))
    fs.mkdirSync(app.TMP_PATH)

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
});

// Load tasks
app.TASKS = PathLoader.load(path.join(__dirname, 'tasks'))

// Load Firebase Queue
app.queueRef = app.admin.database().ref('queue')

// Start Firebase Queue processing
var queue = new Queue(app.queueRef, handleQueueTask)

function handleQueueTask(data, progress, resolve, reject) {
  // Check if task type exists
  if ( !(data.task in app.TASKS)) {
    console.log(`Task [${data.task}] does not exist`)
    return reject()
  }

  // Load task to execute
  let task = app.TASKS[data.task]

  // Delegate call
  task(...arguments)
};

// Log server start
console.log('Queue worker is alive')

// Test
// handleQueueTask({task: 'gif', word: 'test'}, console.log, console.log, console.log)
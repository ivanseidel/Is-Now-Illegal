const fs = require('fs')
const path = require('path')
const async = require('async')
const express = require('express');

const Queue = require('firebase-queue')
const admin = require('firebase-admin')
const storage = require('@google-cloud/storage');

const PathLoader = require('./PathLoader')
const GifGenerator = require('./GifGenerator')

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

// 
// Start HTTP server
// 
app.express = express();

app.express.get('/', (req, res) => {
  res.status(200).send('home');
});

app.express.get('/_ah/health', (req, res) => {
  res.status(200).send('OK '+Date.now());
});

const PORT = process.env.PORT || 8080;
app.express.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});


// 
// Start Firebase Queue processing
// 
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
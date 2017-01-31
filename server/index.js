var Queue = require('firebase-queue'),
    Firebase = require('firebase');

var queueRef = new Firebase('https://is-now-illegal.firebaseio.com/queue');
var queue = new Queue(queueRef, function(data, progress, resolve, reject) {
  // Read and process task data
  console.log(data);

  // Update the progress state of the task
  setTimeout(function() {
    progress(50);
  }, 500);

  // Finish the job asynchronously
  setTimeout(function() {
    resolve();
  }, 1000);
});
const fs = require('fs')
const path = require('path')
const async = require('async')

const GifGenerator = require('../GifGenerator')

// Ger Firebase references
var gifsRef = app.admin.database().ref('gifs')
var gifsStorage = app.gcs.bucket('is-now-illegal.appspot.com')

module.exports = (data, progress, resolve, reject) => {
  // Save start timestamp
  let startTime = Date.now()

  // Read Information about gif
  let gifWord = data.word

  // Validate gif word
  let validChars = /^[a-zA-Z0-9\s\#\$\%\*\"\!\?]+$/i
  if(!gifWord || gifWord.length > 10 || !validChars.test(gifWord)){
    console.log(`[${gifWord}] Rejecting(validation): `, data)
    return reject()
  }

  // Set to UpperCase
  gifWord = gifWord.toUpperCase()

  console.log(`[${gifWord}] New gif task`)

  // Create filepath for gif
  let fileName = gifWord + '.gif'
  let filePath = path.join(app.TMP_PATH, fileName)

  // Get db reference
  let gifRef = gifsRef.child(gifWord)

  // Generate gif
  async.series([

    // Check if gif already exists in DB, and increment view count
    (next) => {
      console.log(`[${gifWord}] Verify cache`)

      gifRef.once('value', (snapshot) => {
        if (snapshot.val() && snapshot.val().url) {
          gifRef.child('views').transaction(function (current_value) {
            return (current_value || 0) + 1;
          });

          console.log(`[${gifWord}] Gif already cached. skipping`)
          return next('ok')
        }

        // Its ok. We create the object later
        return next()
      })
    },

    // Generate Gif
    (next) => {
      console.log(`[${gifWord}] Generate gif`)

      GifGenerator.generateWithWord(gifWord, filePath, next)
    },

    // Upload Gif
    (next) => {
      console.log(`[${gifWord}] Upload gif`)

      gifsStorage.upload(filePath, {
        destination: 'gifs/' + fileName,
        gzip: true,
      }, next);  
    },

    // Create object in database
    (next) => {
      console.log(`[${gifWord}] Saving to database`)

      gifRef.set({
        url: 'https://storage.googleapis.com/is-now-illegal.appspot.com/gifs/'+fileName,
        views: 1,
        created: new Date(),
        processTime: Date.now() - startTime
      }, next)
    },

  ], function (err) {
    // Get final timestamp
    let endTime = Date.now()
    let duration = endTime - startTime

    console.log(`[${gifWord}] Task duration: ${duration}ms`)

    // Remove gif file
    fs.unlink(filePath, () => {})

    // Check for errors
    if (err && err != 'ok') {
      console.log(`[${gifWord}] Error processing gif:`, err)
      return reject()
    }

    console.log(`[${gifWord}] Complete`)
    resolve()
  })
}
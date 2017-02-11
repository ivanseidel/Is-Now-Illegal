const fs = require('fs')
const express = require('express')
const compression = require('compression')
const apicache = require('apicache').middleware
const handlebars = require('handlebars')

// Expose global app object
var app = {}
global.app = app

// Load template
var template = handlebars.compile(fs.readFileSync('index.html').toString())

//
// Start HTTP server
//
app.express = express()
app.express.use(compression())
app.express.use(express.static('public'))

// Set engine
app.express.set('view engine', 'handlebars')

app.express.get('/', (req, res) => {
  res.redirect('http://isnowillegal.com')
})

app.express.get('/:gif.gif', apicache('10 minutes'), (req, res) => {
  const word = req.params.gif || ''
  const filename = word.toUpperCase()
  const uri = `https://storage.googleapis.com/is-now-illegal.appspot.com/gifs/${filename}.gif`

  res.setHeader('Content-Type', 'image/gif')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.redirect(301, uri)
})

app.express.get('/:gif', apicache('10 minutes'), (req, res) => {
  const word = req.params.gif || ''
  const filename = word.toUpperCase()

  // const uri = `http://share.isnowillegal.com/${filename}.gif`
  const uri = `https://storage.googleapis.com/is-now-illegal.appspot.com/gifs/${filename}.gif`

  res.status(200).send(
    template({
      url: uri,
      site: 'IsNowIllegal',
      title: `${word} Is Now Illegal!`,
      gif_url: uri,
      // TODO: this should be dynamic
      gif_preview_url: 'http://share.isnowillegal.com/preview.png',
      description: 'Declare things illegal and trump will sign it.',
      content_type: 'video.other',
      share_url: `http://isnowillegal.com/?${word}`
    })
  )
})

const PORT = process.env.PORT || 8080
app.express.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})

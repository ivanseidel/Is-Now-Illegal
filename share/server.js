const fs = require('fs');
const path = require('path');
const async = require('async');
const express = require('express');
const compression = require('compression');
const apicache = require('apicache').middleware;
const handlebars = require('handlebars');
const request = require('request');

// Expose global app object
var app = {};
global.app = app;

// Load template
var template = handlebars.compile(fs.readFileSync('index.html').toString());

// Home Page
var home = template({
  url: 'http://isnowillegal.com',
  site: 'IsNowIllegal',
  title: 'Is Now Illegal',
  gif_url: 'http://isnowillegal.com',
  description: 'Declare things illegal and trump will sign it',
  content_type: 'website',
});

//
// Start HTTP server
//
app.express = express();
app.express.use(compression());
app.express.use(express.static('public'))

// Set engine
app.express.set('view engine', 'handlebars');

app.express.get('/', (req, res) => {
  res.redirect('http://isnowillegal.com');
});

app.express.get('/:gif.gif', apicache('10 minutes'), (req, res) => {
  const gif = (req.params.gif || '').toUpperCase();
  const uri = `https://storage.googleapis.com/is-now-illegal.appspot.com/gifs/${gif}.gif`;

  res.setHeader('Content-Encoding', 'sdch');
  res.setHeader('Content-Type', 'image/gif');
  request.get(uri).pipe(res);
});

app.express.get('/:gif', apicache('10 minutes'), (req, res) => {
  const gif = (req.params.gif || '').toUpperCase();
  // const uri = `http://share.isnowillegal.com/${gif}.gif`
  const uri = `https://storage.googleapis.com/is-now-illegal.appspot.com/gifs/${gif}.gif`;

  res.status(200).send(
    template({
      url: uri,
      site: 'IsNowIllegal',
      title: `${gif} Is Now Illegal!`,
      gif_url: uri,
      // TODO: this should be dynamic
      gif_preview_url: 'http://share.isnowillegal.com/preview.png',
      description: 'Declare things illegal and trump will sign it.',
      content_type: 'video.other',
      share_url: `http://isnowillegal.com/?${gif}`,
    })
  );
});

const PORT = process.env.PORT || 8080;
app.express.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

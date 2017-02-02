const fs = require('fs')
const path = require('path')
const async = require('async')
const express = require('express');
const mustache = require('mustache');

// Expose global app object
var app = {}
global.app = app

// Load template
var template = mustache.compile(fs.readSync('index.html'));

// 
// Start HTTP server
// 
app.express = express();

app.express.get('/:gif', (req, res) => {
  res.status(200).send('home');
});

const PORT = process.env.PORT || 8080;
app.express.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
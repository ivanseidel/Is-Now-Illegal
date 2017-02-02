const fs = require('fs')
const path = require('path')
const async = require('async')
const express = require('express');
const apicache = require('apicache').middleware;
const handlebars = require('handlebars');
const compression = require('compression');

// Expose global app object
var app = {}
global.app = app

// Load template
var template = handlebars.compile(fs.readFileSync('build/index.html').toString());

// Home Page
var home = template({
	url: 'http://isnowillegal.com',
	site: 'IsNowIllegal',
	title: 'Is Now Illegal',
	gif_url: 'http://isnowillegal.com',
	description: 'Declare things illegal and trump will sign it',
	content_type: 'website',
})

// 
// Start HTTP server
// 
app.express = express();
app.express.use(compression());

app.express.get('/', apicache('1 hour'), (req, res) => {
	res.status(200).send(home)
})

app.express.get('/share/:gif', apicache('1 hour'), (req, res) => {
	gif = encodeURIComponent(req.params.gif || '');
	res.redirect('/'+req.params.gif)
})

app.express.get('/:gif', apicache('10 minutes'), (req, res) => {
	let gif = req.params.gif || ''
	gif = gif.toUpperCase()

	let href = `https://storage.googleapis.com/is-now-illegal.appspot.com/gifs/${gif}.gif`
	res.status(200).send(template({
		url: href,
		site: 'IsNowIllegal',
		title: gif + ' Is Now Illegal',
		gif_url: href,
		description: 'Declare things illegal and trump will sign it',
		content_type: 'video.other',
	}));
});

app.express.use(express.static('build'));
const PORT = process.env.PORT || 8080;
app.express.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
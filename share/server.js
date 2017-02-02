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
var template = handlebars.compile(fs.readFileSync('index.html').toString());

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

app.express.get('/', (req, res) => {
	res.redirect('http://isnowillegal.com')
})

app.express.get('/:gif.gif', (req, res) => {
	const gif = (req.params.gif || '').toUpperCase()
	res.redirect(`https://storage.googleapis.com/is-now-illegal.appspot.com/gifs/${gif}.gif`);
});

app.express.get('/:gif', (req, res) => {//, apicache('10 minutes')
	const gif = (req.params.gif || '').toUpperCase()
	const href = `http://share.isnowillegal.com/${gif}.gif`

	res.status(200).send(template({
		url: href,
		site: 'IsNowIllegal',
		title: gif + ' Is Now Illegal',
		gif_url: href,
		description: 'Declare things illegal and trump will sign it',
		content_type: 'video.other',
		share_url: 'http://isnowillegal.com/?'+gif
	}));
});

const PORT = process.env.PORT || 8080;
app.express.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
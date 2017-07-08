var express = require('express');
var http = require('http');
var path = require('path');

let app = express();
app.port = process.env.PORT || 8080;
app.server = http.Server(app);

var staticAssetsPath = path.resolve(__dirname + '/public/');
console.log('mapped / route to public assets folder: ' + staticAssetsPath);
app.use('/', express.static(staticAssetsPath));

// GET method route
app.get('/sample', (req, res) => {
	res.sendFile(__dirname + '/sample-map.html');
});

app.server.listen(app.port, () => {
	console.log(`Local Server running on *: ${app.port}`);
	console.log(`http://localhost:${app.port}/sample to view sample map`);
});


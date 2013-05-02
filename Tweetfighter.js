/**
*	TODO:
* 		Twitter login for cust http://passportjs.org/guide/twitter/
*		database for saved games
*		twitter api calls
*/
//requirements
var express = require('express');
var http = require('http');
var fs = require('fs');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var player = require('./modules/player.js');
var game = require('./modules/game.js');

server.listen(8080);

//serve 
function basic_get(url, path) {
  app.get(url, function(req, res) {
    res.sendfile(_dirname+path);
  });
}

counter = 0;

//create server
app.use(express.compress());
app.use(express.static(__dirname + '/', { maxAge: 31557600000 }));

// /
basic_get('/', '/tweetfighterbefore.html');


// /socket
basic_get('/socket', '/pages/socket_test.html')

var counter = 0;

var test = io.of('/socket');
test.on('connection', function (socket) {
	socket.emit('initial', 'hello!');
});


function disperse() {
  test.emit('update', {counter: counter});
  counter++;
}
timerID1 = setInterval(disperse, 5000);


// global twitter api calls

function getTrends(){
	var trend = 'http://api.twitter.com/1/trends/weekly.json';
	http.get(trend, function(res) {
		var data = '';
		console.log("Got response: " + res.statusCode);
		res.on("data", function(chunk) {
			data += chunk
		});
		res.on('end', function(){
			var obj = JSON.parse(data);
		});
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
}

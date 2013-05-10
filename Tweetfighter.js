/**
*	TODO:
* 		Things till Demo ready
*			1) twitter data parseing
*		Things till launch ready
*			1) user login
*			2) create legit database that isn't just an object in ram
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
var runningGames = new Object(); //this is a json object, which is kinda like a map

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

//////////////////////////////////////////////////////////
//		START OF	NEW CODE	NOT TESTED 
//////////////////////////////////////////////////////////

//rooms!
var connections = io.of('/');
connections.on('connection', function (socket) {
	socket.on('enter', function (data){
		//add user to room
		socket.join(data.room);
	});
});

//should only be accessed by login user
var legit = io.of('/user');
legit.on('connection', function (socket){
	socket.on('create', function (data) {
		//create new game an add to database
		runningGames[data.name+"game"] = new game(data.player1, data.player2, data.name)
	});
	socket.on('start', function (data){
		//start already made game
		runningGames[data.name] = setinterval(gameHandle(data), data.time); 
	});
	socket.on('killOff', function (data) {
		//end running game
		clearInterval(runningGames[data.name]);
	});
});

function gameHandle(data){
	var holder = runningGames[data.name+"game"];
	connections.in(holder.getName()).emit('update', holder.getStat());
}

//////////////////////////////////////////////////////////
//		END OF		NEW CODE	NOT TESTED 
//////////////////////////////////////////////////////////

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

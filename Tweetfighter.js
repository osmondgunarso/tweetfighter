//requirements
var express = require('express');
var http = require('http').createServer(app);
var fs = require('fs');
var app = express();
var io = require('socket.io').listen(http);
var port = 8888;
//create server
app.use(express.static(__dirname + '/', { maxAge: 31557600000 }));
app.get('/', function(req, res){
    fs.readFile(__dirname + '/twitterAPITest.html', 'utf8', function(err, text){
		res.send(text);
    });
});
app.listen(port);
console.log(port);

//socket stuff
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

//twitter api calls

function getTrends(){
	var trend = 'https://api.twitter.com/1/trends/weekly.json';
	http.get(trend, function(res) {
		console.log("Got response: " + res.statusCode);
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
}

function getTweets(){
	
}
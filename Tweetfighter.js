

//requirements
var express = require('express');
var http = require('http');
var fs = require('fs');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(80);

function basic_get(url, path) {
  app.get(url, function(req, res) {
    fs.readFile(__dirname + path, 'utf8',
      function(err, text) {
        res.send(text);
      }
    );
  });
}

sockets = []
counter = 0;

//create server
app.use(express.compress());
app.use(express.static(__dirname + '/', { maxAge: 31557600000 }));
basic_get('/', '/tweetfighterbefore.html');
basic_get('/socket', '/pages/socket_test.html')

io.sockets.on('connection', function (socket) {
	//socket stuff goes in here
	socket.emit('initial', 'hello!');
  sockets.push(socket)
});

function disperse() {
  s = sockets.slice();
  for (i in s) {
    s[i].emit('update', {counter: counter});
  };
  counter++;
}
timerID1 = setInterval(disperse, 5000);

//twitter api calls

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

function getTweets(player){
	var query = 'http://search.twitter.com/search.json?q=%23'+player.has+
	"&result_type=recent&rpp=100&include_entities=true&since_id="+
	player.pastInformation.tweet;

	http.get(query, function(res) {
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

function findState() {
}

//getTrends();

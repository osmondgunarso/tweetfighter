//requirements
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var fs = require('fs');
var io = require('socket.io').listen(server);


http.createServer(app).listen(888);

//create server
app.use(express.compress());
app.use(express.static(__dirname + '/', { maxAge: 31557600000 }));
app.get('/', function(req, res){
    fs.readFile(__dirname + '/tweetfighterbefore.html', 'utf8', function(err, text){
		res.send(text);
    });
});

io.sockets.on('connection', function (socket) {

	//socket stuff goes in here
	socket.emit('news', { hello: 'world' });

	socket.on('my other event', function (data) {
		console.log(data);
	});

	socket.on('giveMeTweets', function(){
		socket.emit('updateInfo', players);
  });
});

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

getTrends();

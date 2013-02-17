//var and requirements
var express = require ('express');
var http = require ("http");
var server = http.createServer(app);
var app = express();
var io = require ('socket.io').listen(server);

//timer
setInterval(callTwitter(), Math.floor((Math.random()*1000)+1));

//serve pages
app.get("/", function(req, page){
	page.sendfile("pages/test.html");
});

//config
app.listen(12365);
console.log("port 12365");

//sockets
io.sockets.on('connection', function(socket){
	socket.emit('confirm', "howdy");
	socket.on('confirmBack',  function(data){
		console.log("working");
	});
});
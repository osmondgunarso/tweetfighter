//var and requirements
var express = require ('express');
var server = require('http').createServer(app);
var app = express();
var io = require ('socket.io').listen(server);

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
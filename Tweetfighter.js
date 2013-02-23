//requirements
var express = require('express');
var http = require('http').createServer(app);
var fs = require('fs');
var app = express();
var ip = require('socket.io').listen(http);

//create server
app.use(express.static(__dirname + '/'));
app.get('/', function(req, res){
    fs.readFile(__dirname + '/twitterAPITest.html', 'utf8', function(err, text){
        res.send(text);
    });
});
app.listen(8888);
console.log(8888);

//socket stuff
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

//twitter api calls
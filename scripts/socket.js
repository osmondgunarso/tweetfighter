var socket = io.connect('/');
  
socket.on('news', function (data) {
   console.log(data);
   socket.emit('my other event', { my: 'data' });
});

socket.on('updateInfo', function(data){
	//do something to update player object data
});

function callTweets(){
	socket.emit('giveMeTweets')
}

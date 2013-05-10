/**
* Game objects control game
*/
var Player = require('./player.js');
var Twitter = require('ntwitter');

/**
* Game that will hold players
* Strings passed to game object MUST be prefixed with #
* @constructor
* @param {String, String} hash
*/

var game = function (hash1, hash2, roomName) {
	this.name = roomName;
	//construct players based on hashes
	this.player1 = new Player(hash1);
	this.player2 = new Player(hash2);
	//stat should be stored in a way that it's easy to pull from a nosql database
	this.stat = {"one": this.player1.toJSON(), "two": this.player2.toJSON()};
	
	//establish connections with twitter
	this.twit = new Twitter({
	  consumer_key: 'Twitter',
	  consumer_secret: 'API',
	  access_token_key: 'keys',
	  access_token_secret: 'go here'
	});
	
}

game.prototype = {
	/**
	*	progesses game along one round, stores information to stat
	*	@private
	*/
		broadcast : function () {
			//game object will handle calls to twitter
			//pointers
			this.stat = {"one": this.player1.toJSON(), "two": this.player2.toJSON()};
		},
		
	/**
	*	starts fight, takes int of time between rounds in ms
	* 	@param {int} 
	*/
		startFight : function (time) {
			//create connection
			this.twit.stream('statuses/filter', {'track':this.player1.getHash() + " " + this.player2.getHash()}, function (stream){
				stream.on('data', function(data){
					//update player information
					console.log(data);	//not sure how to parse data yet, might want to use search api instead of stream
				});
				twit.currentStream = stream;
			});
		},
	
	/**
	*	stops fight 
	*/
		stopFight : function () {
			//should check if stream is already dead
			this.twit.currentStream.destroy();
		},
	
	/**
	* returns status of game with player health and tweet count
	* @return {JSON}
	*/
		getStats : function () {
			return this.stat;
		},
		
	/**
	* returns name of game
	* @return {String}
	*/
		getname : function() {
			return this.name;
		}
};

module.exports = game;

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
	this.timer = null;
	
}

game.prototype = {
	/**
	*	progesses game along one round, stores information to stat
	*	@private
	*/
		update : function () {
			//game object will handle calls to twitter
			var request = ""
			twit.search(request, {}, function (err, data){
				sort(data); //sudo code holder 
			});			
			//pointers
			this.stat = {"one": this.player1.toJSON(), "two": this.player2.toJSON()};
		},
		
	/**
	*	starts fight, takes int of time between rounds in ms
	* 	@param {int} 
	*/
		startFight : function (time) {
			//create connection
			timer = setInterval(update, time);
		},
	
	/**
	*	stops fight 
	*/
		stopFight : function () {
			clearInterval(timer);
			timer = null;
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

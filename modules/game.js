/**
* Game objects control game
*/
var player = require('./player.js');

/**
* Game that will hold players
* @constructor
* @param {String, String} hash
*/

var game = function(hash1, hash2){
	this.owner; //not sure if good idea
	//construct players based on hashes
	this.player1 = new player(hash1);
	this.player2 = new player(hash2);
	this.ticker;
	//stat should be stored in a way that it's easy to pull from a nosql database
	this.stat = {"one": this.player1.toJSON(), "two": this.player2.toJSON()};
}

game.prototype = {
	/**
	*	progesses game along one round, stores information to stat
	*	@private
	*/
		update : function(){
			this.player1.getTweet();
			this.player2.getTweet();
			//pointers
			this.stat = {"one": this.player1.toJSON(), "two": this.player2.toJSON()};
		},
		
	/**
	*	starts fight, takes int of time between rounds in ms
	* 	@param {int} 
	*/
		startFight : function(time){
			this.ticker = setInterval(update, time);
		},
	
	/**
	*	stops fight 
	*/
		stopFight : function(){
			clearInterval(this.ticker)
		},
	
	/**
	* returns status of game with player health and tweet count
	* @return {JSON}
	*/
		getStats : function(){
			return this.stat;
		}
};

module.exports = game;

/**
* Module version of player class
*/

/**
* Player that will hold tweet information
* @constructor
* @param {String} hash
*/

var player = function(hash){
	this.hash = hash;
	this.health = 100;
	this.pastInformation = {tweet:0, face:0};
	this.numTweets = 0;
	this.numFace = 0;
	this.sprites = [];
	this.state = 0;
	this.count = 0;
	this.display = "";
}

// function in the prototype are seperated by commas because it looks like it's treating it like a JSON object of functions... weird
player.prototype = {

	/**
	* Returns total number of mentions on the web
	* @return {Number}
	*/
	numTot : function(){
		return this.numTweets + this.numFace;
	},

	/**
	* Returns a string of HTML, should be changed to call the goog.dom maybe
	* @return {String}
	*/
	createFirst : function() {
		return this.hash + "</br><div id='stats"+this.hash+"'>" + "Health: " + this.health + ", Tweets: " + this.numTweets + "</div><div class='progress progress-striped active'> <div class='bar' id = '"+ this.hash +"' style='width: " + this.health +"%'></div> </div>";
	},

	/**
	* Returns status of health and number of mentions in a string
	* @return {JSON object}
	*/
	toJSON : function(){
		return {"Health" :this.health, "Tweets" : this.numTweets, "name": this.hash}
	},
	
	/**
	* Returns hash tag of player
	* @return {String}
	*/
	getHash : function(){
		return this.hash;
	}
};

module.exports = player;
goog.provide('com.tweetfighter.player');

/**
* Player that will hold tweet information
* @constructor
* @param {String} hash
*/

//this is for the front end, we need to determine what needs to go here
com.tweetfighter.player = function(hash){
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

/**
* Returns total number of mentions on the web
* @return {Number}
*/
com.tweetfighter.player.prototype.numTot = function(){
	return this.numTweets + this.numFace;
}

/**
* Returns a string of HTML, should be changed to call the goog.dom maybe
* @return {String}
*/
com.tweetfighter.player.prototype.createFirst = function() {
	
	return this.hash + "</br><div id='stats"+this.hash+"'>" + "Health: " + this.health + ", Tweets: " + this.numTweets + "</div><div class='progress progress-striped active'> <div class='bar' id = '"+ this.hash +"' style='width: " + this.health +"%'></div> </div>";
}

/**
* Returns status of health and number of mentions in a string
* @return {String}
*/
com.tweetfighter.player.prototype.toString = function(){
	return "Health: " + this.health + ", Tweets: " + this.numTweets;
}
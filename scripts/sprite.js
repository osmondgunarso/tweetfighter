goog.provide('com.tweetfighter.sprite');

/**
* Sprite that will hold image of player and position
* @constructor
* @param {String} location of pictuer
*/
com.tweetfighter.sprite = function(source) {
	'use strict';
	this.img = new Image();
	this.img.src = source;
	this.position = {x: 0, y:0};
	this.origin = {x:0, y:0};
	this.rotation = 0;
	this.scale = {x:1, y:1};
	this.children = new Array();
}

/**
* draws the sprite onto the canvas
* @param {CanvasRenderingContext2D}
*/
com.tweetfighter.sprite.prototype.draw = function(context){
	'use strict';
	context.save();
	context.translate(this.position.x, this.position.y);
	context.scale(this.scale.x, this.scale.y);
	context.rotate(this.rotation);
	context.translate(-this.origin.x, -this.origin.y);
	context.drawImage(this.img, 0,0);
	for(var i = 0; i < this.children.length; i++){
		this.children[i].draw(context);
	}
	context.restore();
};
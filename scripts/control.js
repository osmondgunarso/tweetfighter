goog.provide('com.tweetfighter.control');

goog.require('com.tweetfighter.player');
goog.require('com.tweetfighter.sprite');
goog.require('goog.dom');

//dom work should be all done here

/*todo wish list
	1. migrate to google closure
	2. display tweets somewhere
	http://closure-library.googlecode.com/svn/trunk/closure/goog/demos/
		we need progress bars
		bubbles
		buttons
*/

//global
/**
* canvas
* @type {Element}
*/
var c;
/**
* canvas context
8 @type {CanvasRenderingContext2D}
*/
var ctx;
var stopCode;
/**
* array of sprites
* @type {Array.<com.tweetfighter.sprite>}
*/
var seaSet;
/**
* array of sprites
* @type {Array.<com.tweetfighter.sprite>}
*/
var SFSet;
/**
* first player
* @type {com.tweetfighter.player}
*/
var player1;
/**
* second player
* @type {com.tweetfighter.player}
*/
var player2;
/**
* sprite
* @type {com.tweetfighter.sprite};
*/
var Sprite = com.tweetfighter.sprite;
/**
* Player
* @type {com.tweetfighter.player}
*/
var Player = com.tweetfighter.player;

//events
/**
* places hashtags in button onto the fight stage
* starts fight
* @param {element}
*/
function placeFight(btn) {
		$('#firstBox').val(btn.value.split(" vs ")[0]);
		$('#secondBox').val(btn.value.split(" vs ")[1]);
		start();
}

/**
* listens to start fight
*/
$(document).ready(function () {
	'use strict';
	preLoad();
	$('#button').click(function () {
		start();
	});
	$('.hashes').keypress(function (event) {
		if (event.which === 13)
			start();
	});
});


//front end work
//takes JSON object from twitter for tweets and places them inside of the #trends div
// this work should be in the backend 
/**
* takes JSON object from twitter and places inside trends div
* @param {JSON}
*/
function placeTrends(data) {
	'use strict';
	var today = new Date().toISOString().split("T")[0], trendsHTML = "";
	for(var i = 0; i < 8; i = i+2){
		trendsHTML = trendsHTML + "<button class='btn btn-primary fights btn-block' id='trend"+i+"' onClick='placeFight(this);' value='"+data.trends[today][i].name + " vs " + data.trends[today][i+1].name + "'>"+data.trends[today][i].name + " vs " + data.trends[today][i+1].name + "</button>";
	}
	goog.dom.getElement("trends").innerHTML = trendsHTML;
}

//loads sprites for fighters before the game starts
//images probably shouldn't be served from the main server 
function preLoad() {
	'use strict';
	getTrends();
	seaSet =[];
	SFSet = [];
	for(var i = 1; i <= 9; i++){
		seaSet.push(new Sprite("photos/Seattle"+i+".png"));
	} 
	for(var i = 1; i <= 9; i++){
		SFSet.push(new Sprite("photos/SanFran"+i+".png"));
	}
}

//pulls tags from text boxes and loads
function start() {
	'use strict';
	$('.hashes').attr("disabled", "disabled");
	player1 = new Player($('#firstBox').val());
	player2 = new Player($('#secondBox').val());
	if (player1.hash.charAt(0) == '#')
		player1.hash = player1.hash.substring(1);
	if (player2.hash.charAt(0) == '#')
		player2.hash = player2.hash.substring(1);
	loadShit();
	firstUpdate(player1);
	firstUpdate(player2);
	debugInfo();
	clearInterval(stopCode);
	stopCode = setInterval(function(){update()}, 1000);
}

function update() {
	'use strict';
	console.log(stopCode);
	//client should recive calls not make them
	makeCalls(player1);
	makeCalls(player2);
	findState();
	drawEverything();
	updateTable();
	console.log(player1);
	console.log(player2);
}

function updateTable() {
	'use strict';
	$('#tweet1').html(player1.display);
	$('#tweet2').html(player2.display);
	$('#stats'+player1.hash).html(player1.toString());
	$('#stats'+player2.hash).html(player2.toString());
	$('#'+player1.hash).css('width', player1.health+'%');
	$('#'+player2.hash).css('width', player2.health+'%');
}
//canvas
function drawEverything() {
	'use strict';
	c.width = c.width;
	player1.sprites[player1.state].draw(ctx);
	player2.sprites[player2.state].draw(ctx);
}

//loading shit
function loadShit() {
	'use strict';
	player1.sprites = seaSet;
	player2.sprites = SFSet;
	c = document.getElementById("myCanvas");
	ctx=c.getContext("2d");
	for(var i = 0; i < player1.sprites.length; i++){
		player1.sprites[i].position = {x : 10, y: 10};
	}
	for(var i = 0; i < player2.sprites.length; i++){
		player2.sprites[i].position ={x : c.width-player2.sprites[i].img.width, y: 10};
	}
}

/**
* generates information of fight
* CAUTION: THE ORDER THE DIVS ARE MADE IS VERY IMPORANT AND VERY CONFUSING
* [ 0 | 1 | 2 | 3 ]
* [ tweets 2 | stats 1 | stats 2 | tweets 2 ]
*/
function debugInfo() {
	'use strict';
	$('#tweets').empty();
	var infoBoxes = [];
	for (var i = 0; i < 4; i++){
		infoBoxes.push(document.createElement("div"));
	}
	$(infoBoxes[0]).attr({id: "tweet1", class: "alert alert-block display"});
	$(infoBoxes[1]).attr({class: "display"});
	$(infoBoxes[2]).attr({class: "display"});
	$(infoBoxes[3]).attr({id: "tweet2", class: "alert alert-block display"});
	$(infoBoxes[1]).html(player1.createFirst());
	$(infoBoxes[2]).html(player2.createFirst());
	$('#tweets').append(infoBoxes);
}

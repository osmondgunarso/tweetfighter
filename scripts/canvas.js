/*todo wish list
	1. migrate to google closure
	2. display tweets somewhere
	http://closure-library.googlecode.com/svn/trunk/closure/goog/demos/
		we need progress bars
		bubbles
		buttons
*/

//global
var c;
var ctx;
var stopCode;
var seaSet;
var SFSet;
var player1;
var player2;

//events
//adds click listner for the fight buttons on the side of the page
function setListen() {
	'use strict';
	$(".fights").click(function () {
		$('#firstBox').val(this.innerHTML.split(" vs ")[0]);
		$('#secondBox').val(this.innerHTML.split(" vs ")[1]);
		start();
	});
}

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
function placeTrends(data) {
	'use strict';
	var today = new Date().toISOString().split("T")[0], trendsHTML = "";
	for(var i = 0; i < 8; i = i+2){
		trendsHTML = trendsHTML + "<button class='btn btn-primary fights' id='trend"+i+"'>"+data.trends[today][i].name + " vs " + data.trends[today][i+1].name + "</button></br></br>";
	}
	$('#trends').html(trendsHTML);
	setListen();
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
	makeCalls(player2)
	// states should be done in the back
	findState();
	drawEverything();
	updateTable();
	console.log(player1);
	console.log(player2);
}

function updateTable() {
	'use strict';
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

//objects
function Sprite(source) {
	'use strict';
	this.img = new Image();
	this.img.src = source;
	this.position = {x: 0, y:0};
	this.origin = {x:0, y:0};
	this.rotation = 0;
	this.scale = {x:1, y:1};
	this.children = new Array();
}

Sprite.prototype.draw = function(context){
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

function debugInfo() {
	'use strict';
	$('#tweets').empty();
	var row = document.createElement("tr");
	var d1 = document.createElement("td");
	var d2 = document.createElement("td");
	
	$(d1).html(player1.createFirst());
	$(d2).html(player2.createFirst());
	$(row).append(d1);
	$(row).append(d2);
	$('#tweets').html(row);
}


//global
	var c;
	var ctx
//events
	//adds click listner for the fight buttons on the side of the page
    function setListen(){
        $(".fights").click(function(){
			$('#firstBox').val(this.innerHTML.split(" vs ")[0]);
			$('#secondBox').val(this.innerHTML.split(" vs ")[1]);
			start();
		});
    }
	
	$(document).ready(function(){
		preLoad();
		$('#button').click(function(){
			start();
		});
		
		$('.hashes').keypress(function(event){
			if (event.which == 13)
				start();
		});
	});
	
	
//front end work
	//takes JSON object from twitter for tweets and places them inside of the #trends div
	function placeTrends(data){
		var today = new Date().toISOString().split("T")[0];
		var trendsHTML = "";
		for(var i = 0; i < 4; i = i+2){
			trendsHTML = trendsHTML + "<button class='btn btn-primary fights' id='trend"+i+"'>"+data.trends[today][i].name + " vs " + data.trends[today][i+1].name + "</button></br></br>";
		}
		$('#trends').html(trendsHTML);
		console.log(trendsHTML);
		setListen();
	}
	
	//loads sprites for fighters before the game starts
	function preLoad(){
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
	function start(){
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
		console.log(stopCode);
		//TODO: needs to be cleaned, could be run in a loop
		//getFace(player1);
		//getFace(player2);
		getTweets(player1);
		getTweets(player2);
		if (player1.numTot() > player2.numTot()){
			player2.health -= 10;
			player2.state = 4;
			if (player1.state == 3)
				player1.state = 5;
			else
				player1.state = 3;
			if (player2.health == 0) {
				player2.state = 6;
				clearInterval(stopCode);
				setTimeout(function(){
					var c = document.getElementById("myCanvas");
					var ctx=c.getContext("2d");
					c.width = c.width;
					player1.state = 8;
					player1.sprites[player1.state].draw(ctx);
					$('.hashes').attr("disabled", false);
				}, 1000);
			}
		}
		if (player2.numTot() > player1.numTot()){
			player1.health -= 10;
			player1.state = 4;
			if (player2.state == 3)
				player2.state = 5;
			else
				player2.state = 3;
			if (player1.health == 0) {
				clearInterval(stopCode);
				player1.state = 6;
				setTimeout(function(){
					player2.state = 8;
					c.width = c.width;
					player2.sprites[player2.state].draw(ctx);
					$('.hashes').attr("disabled", false);
				}, 1000);
			}
		}
		if (player1.numTot() == player2.numTot()) {
			player1.state = 1;
			player2.state = 1;
		}
		
		drawEverything();
		updateTable();
		console.log(player1);
		console.log(player2);
	}
	
	function updateTable(){
		$('#stats'+player1.hash).html(player1.toString());
		$('#stats'+player2.hash).html(player2.toString());
		$('#'+player1.hash).css('width', player1.health+'%');
		$('#'+player2.hash).css('width', player2.health+'%');
	}
//canvas

	function drawEverything(){
		c.width = c.width;
		player1.sprites[player1.state].draw(ctx);
		player2.sprites[player2.state].draw(ctx);
	}
//objects
	function Sprite(source){
		this.img = new Image();
		this.img.src = source;
		this.position = {x: 0, y:0};
		this.origin = {x:0, y:0};
		this.rotation = 0;
		this.scale = {x:1, y:1};
		this.children = new Array();
	}

	Sprite.prototype.draw = function(context){
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

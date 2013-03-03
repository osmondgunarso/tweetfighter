//events
	//adds click listner for the fight buttons on the side of the page
    function setListen(){
        $(".fights").click(function(){
			$('#firstBox').val(this.innerHTML.split(" vs ")[0]);
			$('#secondBox').val(this.innerHTML.split(" vs ")[1]);
			start();
		});
    }
		
//front end work
		//takes JSON object from twitter for tweets and places them inside of the #trends div
		function placeTrends(data){
			today = new Date().toISOString().split("T")[0];
			var trendsHTML = "";
			for(var i = 0; i < 4; i = i+2){
				trendsHTML = trendsHTML + "<button class='btn btn-primary fights' id='trend"+i+"' draggable='true' ondragstart="+drag(event)+">"+data.trends[today][i].name + " vs " + data.trends[today][i+1].name + "</button></br></br>";
			}
			$('#trends').html(trendsHTML);
			console.log(trendsHTML);
			setListen();
		}
		
		//loads sprites for fighters before the game starts
		function preLoad(){
			getTrends();
			seaSet = new Array();
			SFSet = new Array();
			for(var i = 1; i <= 9; i++){
				seaSet.push(new Sprite("photos/Seattle"+i+".png"));
			} 
			for(var i = 1; i <= 9; i++){
				SFSet.push(new Sprite("photos/SanFran"+i+".png"));
			}
		}
		function sumTotals(player){
			player.numTot = player.Tweets + player.numFace;
		}
		function update() {
			console.log(stopCode);
			//TODO: needs to be cleaned, could be run in a loop
			getFace(player1);
			getFace(player2);
			getTweets(player1);
			getTweets(player2);
			sumTotals(player1);
			sumTotals(player2);
			if (player1.numTot > player2.numTot){
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
			if (player2.numTot > player1.numTot){
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
						var c = document.getElementById("myCanvas");
						var ctx=c.getContext("2d");
						c.width = c.width;
						player2.sprites[player2.state].draw(ctx);
						$('.hashes').attr("disabled", false);
					}, 1000);
				}
			}
			if (player1.numTot == player2.numtTot) {
				player1.state = 1;
				player2.state = 1;
			}
			
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

		
//drag and drop add copy pasta
		function allowDrop(ev){
		//	ev.preventDefault();
		}

		function drag(ev){
		//	ev.dataTransfer.setData("Text",ev.target.id);
		}

		function drop(ev){
		//	ev.preventDefault();
		//	var data=ev.dataTransfer.getData("Text");
		//	ev.target.appendChild(document.getElementById(data));
		}
		
//loading shit
		function loadShit() {
			player1.sprites = seaSet;
			player2.sprites = SFSet;
			var c = document.getElementById("myCanvas");
			var ctx=c.getContext("2d");
			for(var i = 0; i < player1.sprites.length; i++){
				player1.sprites[i].position = {x : 10, y: 10};
			}
			for(var i = 0; i < player2.sprites.length; i++){
				player2.sprites[i].position ={x : c.width-player2.sprites[i].img.width, y: 10};
			}
			stopCode2 = setInterval(function(){
				c.width = c.width;
				player1.sprites[player1.state].draw(ctx);
				player2.sprites[player2.state].draw(ctx);
			},1000/60);
		}

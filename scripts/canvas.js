//canvas
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

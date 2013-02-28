		//bad globals
		var seaSet;
		var SFSet;
		var today;
		//twitter
		function Player(hash) {
			this.hash = hash;
			this.health = 100;
			this.pastInformation = 0;
			this.numTweets = 0;
			this.sprites = new Array();
			this.state = 0;
			this.count = 0;
		}
		
		Player.prototype.createFirst = function() {
			return this.hash + "</br><div id='stats"+this.hash+"'>" + "Health: " + this.health + ", Tweets: " + this.numTweets + "</div><div class='progress progress-striped active'> <div class='bar' id = '"+ this.hash +"' style='width: " + this.health +"%'></div> </div>";
		}
		
		Player.prototype.toString = function(){
			return "Health: " + this.health + ", Tweets: " + this.numTweets;
		}
		
		$(document).ready(function(){
			preLoad();
			$('#button').click(function(){
				start();
			});
			
			$('#firstBox').keypress(function(event){
				if (event.which == 13)
					start();
			});
			
			$('#secondBox').keypress(function(event){
				if (event.which == 13)
					start();
			});
		});
		
		var stopCode;
		var stopCode2;
		
		//timer
		function start(){
			$('#firstBox').attr("disabled", "disabled");
			$('#secondBox').attr("disabled", "disabled");
			player1 = new Player(document.getElementById("firstBox").value);
			player2 = new Player(document.getElementById("secondBox").value);
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
		
		function getTrends(){
		var req = $.ajax({
				type: 'GET',
				dataType: 'jsonp',
				url: 'https://api.twitter.com/1/trends/weekly.json',
				success: function(data) {
					//console.log(data);
					placeTrends(data);
					$('#error').empty();
				},
				error: function(xhr, status, errorThrown) {
					console.log(errorThrown);
					$('#error').empty();
					$('#error').append("Error :(. Try again?");
					$('#textbox').attr("disabled", false);
				}
		});
		}
		
		function placeTrends(data){
			today = new Date().toISOString().split("T")[0];
			var trendsHTML = "";
			for(var i = 0; i < 8; i = i+2){
				trendsHTML = trendsHTML + data.trends[today][i].name + " vs " + data.trends[today][i+1].name + "</br>";
			}
			$('#trends').html(trendsHTML);
			console.log(trendsHTML);
		}
		
		function firstUpdate(player) {
			var req = $.ajax({
				type: 'GET',
				dataType: 'jsonp',
				url: 'http://search.twitter.com/search.json?q=%23'+player.hash+"&result_type=recent&rpp=1&include_entities=true&since_id="+player.pastInformation,
				success: function(data) {
					player.numTweets = 0;
					player.pastInformation = data.max_id;
					console.log(data);
					$('#error').empty();
				},
				error: function(xhr, status, errorThrown) {
					player.numTweets = 0;
					console.log(errorThrown);
					$('#error').empty();
					$('#error').append("Error :(. Try again?");
					$('#textbox').attr("disabled", false);
				}
			});
		}
		function update() {
			console.log(stopCode);
			getTweets(player1);
			getTweets(player2);
			if (player1.numTweets > player2.numTweets){
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
						clearInterval(stopCode2);
						var c = document.getElementById("myCanvas");
						var ctx=c.getContext("2d");
						c.width = c.width;
						player1.state = 8;
						player1.sprites[player1.state].draw(ctx);
						$('#firstBox').attr("disabled", false);
						$('#secondBox').attr("disabled", false);
					}, 2000);
				}
			}
			if (player2.numTweets > player1.numTweets){
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
						player2.sprites[player1.state].draw(ctx);
						$('#firstBox').attr("disabled", false);
						$('#secondBox').attr("disabled", false);
					}, 2000);
				}
			}
			if (player1.numTweets == player2.numTweets) {
				player1.state = 1;
				player2.state = 1;
			}
			
			updateTable();
			console.log(player1);
			console.log(player2);
		}
		
		//get tweets
		function getTweets(player) {
			//$('#tweets').empty();
			$('#error').empty();
			
			var req = $.ajax({
				type: 'GET',
				dataType: 'jsonp',
				url: 'http://search.twitter.com/search.json?q=%23'+player.hash+"&result_type=recent&rpp=100&include_entities=true&since_id="+player.pastInformation,
				success: function(data) {
					player.numTweets = 0;
					player.pastInformation = data.max_id;
					console.log(data);
					$('#error').empty();
					if (data.max_id != data.since_id)
						player.numTweets = data.results.length;
				},
				error: function(xhr, status, errorThrown) {
					player.numTweets = 0;
					console.log(errorThrown);
					$('#error').empty();
					$('#error').append("Error :(. Try again?");
					$('#textbox').attr("disabled", false);
				}
			});
		}
		
		function updateTable(){
			$('#stats'+player1.hash).html(player1.toString());
			$('#stats'+player2.hash).html(player2.toString());
			$('#'+player1.hash).css('width', player1.health+'%');
			$('#'+player2.hash).css('width', player2.health+'%');
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
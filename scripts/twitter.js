//idealy nothing in this file will ever use DOM
		
		//twitter
		function Player(hash) {
			this.hash = hash;
			this.health = 100;
			this.pastInformation = {tweet:0, face:0};
			this.numTweets = 0;
			this.numFace = 0;
			this.sprites = [];
			this.state = 0;
			this.count = 0;
		}
		
		Player.prototype.numTot = function(){
			return this.numTweets + this.numFace;
		}
		Player.prototype.createFirst = function() {
			return this.hash + "</br><div id='stats"+this.hash+"'>" + "Health: " + this.health + ", Tweets: " + this.numTweets + "</div><div class='progress progress-striped active'> <div class='bar' id = '"+ this.hash +"' style='width: " + this.health +"%'></div> </div>";
		}
		
		Player.prototype.toString = function(){
			return "Health: " + this.health + ", Tweets: " + this.numTweets;
		}

		var stopCode;
		
		
		function firstUpdate(player) {
			var req = $.ajax({
				type: 'GET',
				dataType: 'jsonp',
				url: 'http://search.twitter.com/search.json?q=%23'+player.hash+"&result_type=recent&rpp=1&include_entities=true&since_id="+player.pastInformation.tweet,
				success: function(data) {
					player.numTweets = 0;
					player.pastInformation.tweet = data.max_id;
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
			player.pastInformation.face = Math.round(+new Date()/1000);
		}
		
		//get facebook post from last time updates
		function getFace(player){
			var req = $.ajax({
					type: 'GET',
					dataType: 'jsonp',
					url: 'https://graph.facebook.com/search?since='+player.pastInformation.face+'&q='+player.hash+'&type=post',
					success: function(data) {
						player.numface = data.length;
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
		
		//get tweets
		function getTweets(player) {
			$('#error').empty();
			
			var req = $.ajax({
				type: 'GET',
				dataType: 'jsonp',
				url: 'http://search.twitter.com/search.json?q=%23'+player.hash+"&result_type=recent&rpp=100&include_entities=true&since_id="+player.pastInformation.tweet,
				success: function(data) {
					player.numTweets = 0;
					player.pastInformation.tweet = data.max_id;
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
		
		//todays trends
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
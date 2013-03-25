//idealy nothing in this file will ever use DOM
		//twitter
		
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
						console.log(data);
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
		
		function makeCalls(player){
			getFace(player);
			getTweets(player);
		}
		
function findState() {
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
}
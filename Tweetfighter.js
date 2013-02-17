//var and requirements
var express = require ('express');
var app = express();


//serve pages
app.get("/", function(req, page){
	page.sendfile("twitterAPITest.html");
});

//config
app.listen(12365);
console.log("port 12365");

var express = require ('express');
var app = express();

app.get("/", function(req, page){
	page.sendfile("pages/test.html");
});

app.listen(12365);
console.log("port 12365");
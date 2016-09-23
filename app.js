var express = require('express');

var app = express();
var port = 5000;

app.use(express.static('public'));
app.use(express.static('bower_components'));

app.set('view engine', 'ejs');

app.get('/', function(req, res){
	res.render("index");
})
app.listen(port,function(){
	console.log('running on ' + port);
})
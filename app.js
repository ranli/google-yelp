var express = require('express');
var yelpService = require('./service/yelpService')();
var http = require('https');


var app = express();
var port = process.env.PORT || 1000;

app.use(express.static('public'));
app.use(express.static('bower_components'));

app.set('view engine', 'ejs');


app.get('/', function(req, res){
	res.render("index");
});


app.get('/yelp', function(req, res){
	var term = req.query.term,
		location = req.query.location;
	yelpService.getBusiness(term, location, function(err,data){
	  res.json(data);
	});
});


app.listen(port,function(){
	console.log('running on ' + port);
})
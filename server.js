var express = require('express');
var url = require('url');
var app = express();
app.enable('trust proxy');
var port = process.env.PORT || 8080;
var isUrlRegExp = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&/=]*)/g);

function generate4digits(digitCount) {
	var result = '';
	for(var i =0; i < digitCount; i++) {
	  result += Math.floor(Math.random() * 10);
	}
	return result;
}

app.get('/', function(req, res){
	res.send('Url shortener microservice.');
	res.status(200).end();
});

app.get('/:id', function(req, res){
	var url = app.locals[req.params.id];	
	res.status(302).redirect(url);
});


app.get('/new/*', function(req, res){
	var result = {};
	//console.log(req.route);
	var urlParam = /^\/new\/(.*)$/g.exec(req.path)[1];
	if(isUrlRegExp.test(urlParam)) {
		var key = generate4digits(4);
		app.locals[key] = urlParam;
		result.orginal_url = urlParam;
		result.short_url = req.protocol + '://'+ req.hostname + '/' + key;
	}else {
		result.error = 'Wrong url format, make sure you have a valid protocol and real site.';
	}
	res.send(result);
	res.status(200).end();
	  
});

app.listen(port, function(){
	console.log(`App listening at port: ${port} ...`);
});

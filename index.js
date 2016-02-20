var http = require('http');
var express = require('express');
var expressWinston = require('express-winston');
var bodyParser = require('body-parser');
var colors = require('colors');
var compression = require('compression');
var cors = require('cors');

var config = require('./backend/config');
var routers = require('./backend/routers');

var MongoClient = require('mongodb').MongoClient;

var db;

MongoClient.connect("mongodb://localhost:27017/feed", function(err, database) {
	if(err){
		throw err;
	} else {
    console.log("connected!");
		db = database;
	}
});


var app = express();
app.use(expressWinston.logger(config.WINSTON_LOGGER_OPTS));
app.use(compression());
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(__dirname + '/uploads'));

app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use('/plat', routers.plat);
app.use('/menu', routers.menu);
app.use('/users', routers.user);

app.get('*', function(req, res) { console.log(__dirname + req.originalUrl); res.sendFile(__dirname + req.originalUrl); })

http.createServer(app).listen(config.PORT);

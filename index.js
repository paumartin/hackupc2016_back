var http = require('http');
var express = require('express');
var expressWinston = require('express-winston');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var colors = require('colors');
var compression = require('compression');
var cors = require('cors');

var config = require('./backend/config');
require('./backend/models').init();
var routers = require('./backend/routers');

mongoose.connect(config.DB_URI, function(error, connected) {
    if (error) { console.error(error.red); process.exit(1); }
    else console.log("Successfully connected to database".green);
});

var app = express();
app.use(expressWinston.logger(config.WINSTON_LOGGER_OPTS));
app.use(compression());
app.use(cors());
app.use(bodyParser.json());

// app.get('*', function(req, res) { res.sendFile(__dirname + '/frontend/index.html'); })
app.all('*', function(req, res) { res.status(404).send("Recurso no encontrado"); });

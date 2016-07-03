var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var router = express.Router();
var app = express();
//var bson = require('bson');

var http = require('http').Server(app);
var io = require('socket.io')(http);


mongoose.connect(config.database, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to the database');
    }
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

var api = require('./app/routes/api')(app, express, io);


app.get('/example/*', function(req, res) {
    res.sendFile(__dirname + '/public/app/mobile/example.html');

});

app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/public/app/mainApp/views/index.html');
});



http.listen(config.port, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Listening on port 3000");
    }
});

//============ SECOND APP --


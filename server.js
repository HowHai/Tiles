'use strict';

/**
 * First we set the node enviornment variable if not set before
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Module dependencies.
 */
var config = require('./config/config'),
	mongoose = require('mongoose');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */
// Bootstrap db connection
var db = mongoose.connect(config.db);

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();


// Start the app by listening on <port>
// app.listen(config.port);

// Socket.io test
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(config.port);

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

// ENDsocket

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Express app started on port ' + config.port);


// var server = http.createServer(app);
// server.listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });

// // Socket.io
// var io = require('socket.io').listen(server);
// io.sockets.on('connection', function (socket) {
//   socket.on('setPseudo', function (data) {
//     socket.set('pseudo', data);
//   });

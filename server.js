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

// Socket.io test
var Comment = mongoose.model('Comment');

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
server.listen(config.port);

io.sockets.on('connection', function (socket) {
  // Send current user's location to new user.
  socket.on('sendLocationToNewUser', function(data){
    var clients = io.sockets.clients().length;
    console.log("This ran!");
    console.log(data.socketId);
    io.sockets.socket(data.socketId).emit("newUserGetsLocation", {clientsCount: clients});
  });

  // Get user's current tileId
  socket.on('giveTile', function(data) {
    data.socketId = socket.id;
    // Emits user's tileId and socketId to all users except sender.
    socket.broadcast.emit("takeTile", data);
  });

  // Emit current user's position.
  socket.emit('currentPosition', 'this is a test, only I can see it');

  // Response to sendVote
  socket.on('sendLike', function(data) {
    io.sockets.emit('giveBackLike', data);
  });

  socket.on('disconnect', function() {
    io.sockets.emit('user disconnected', { socketId: socket.id });
  });

});

// ENDsocket

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('Express app started on port ' + config.port);


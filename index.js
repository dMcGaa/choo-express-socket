var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var { socketIdeaUpdate } = require('./src/socket-actions');

app.use(express.static('dist'));

app.set('port', (process.env.PORT || 8080));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/dist/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
  socket.on(socketIdeaUpdate, function(msg){
    console.log(`${socketIdeaUpdate}: ` + msg);
    io.emit(socketIdeaUpdate, msg);
  });
});

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

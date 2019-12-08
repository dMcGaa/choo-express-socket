var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

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
  socket.on('voting update', function(msg){
    console.log('voting update: ' + msg);
    io.emit('voting update', msg);
  });
});

http.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
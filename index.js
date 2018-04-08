var express = require('express');
var socket = require('socket.io');

//App Setup
var app = express();
var server = app.listen(8000,function(){
    console.log('Listening on port: 8000');
});

//File to use
app.use(express.static('firebasenode'));  //Change according to the folder where the .html file is located.

//Socket Setup
var io = socket(server);

io.on('conncection',function(socket){
    console.log('Connection Established');
    socket.on('disconnect',function(){
        console.log('Connection Disbanded');
    });

    socket.on('LED.On',function(data){
        io.sockets.emit('LED.On',data);
            console.log(data);
    });

    socket.on('LED.Off',function(data){
        io.sockets.emit('LED.Off',data);
            console.log(data);
    });

    socket.on('Sensor.On',function(data){
        io.sockets.emit('Sensor.On',data);
            console.log(data);
    });

    socket.on('LED.Off',function(data){
        io.sockets.emit('Sensor.Off',data);
            console.log(data);
    });
});
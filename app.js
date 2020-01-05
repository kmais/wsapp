var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log("server running");

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});




io.sockets.on("connection", function (socket) {
  connections.push(socket);
  console.log("connected: %s sockets connected", connections.length);
  if (connections.length < 2) {
    initiator = true
  } else {
    initiator = false
  }
  socket.emit('roomInfo', {
    roomSize: connections.length,
    initiator: initiator
  })



  socket.on("disconnect", function (data) {
    //disconnect
    connections.splice(connections.indexOf(socket), 1);
    console.log("disconnected: %s sockets connected", connections.length);
  });

  socket.on("send message", function (data) {
    console.log(data);
    io.sockets.emit("new message", {
      msg: data
    });
  });


  socket.on('offer', function (sdp) {

    console.log('offer received')
    // console.log(sdp)
    // can choose to broadcast it to whoever you want
    // socket.broadcast.emit('voice', blob);
    socket.emit("offer", sdp)
    console.log('offer re-emited')
  });

  socket.on('answer', function (sdp) {

    console.log('answer received')
    // console.log(sdp)
    // can choose to broadcast it to whoever you want
    // socket.broadcast.emit('voice', blob);
    socket.emit("offer", sdp)

  });

});